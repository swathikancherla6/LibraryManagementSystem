package com.library.management.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.management.dto.request.IssueBookRequest;
import com.library.management.dto.request.LoginRequest;
import com.library.management.entity.*;
import com.library.management.enums.BorrowStatus;
import com.library.management.enums.RoleType;
import com.library.management.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BorrowFlowIntegrationTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;
    @Autowired MemberRepository memberRepository;
    @Autowired CategoryRepository categoryRepository;
    @Autowired BookRepository bookRepository;
    @Autowired BorrowRecordRepository borrowRecordRepository;
    @Autowired PasswordEncoder passwordEncoder;

    private String adminToken;
    private Long memberId;
    private Long bookId;

    @BeforeEach
    void setUp() throws Exception {
        borrowRecordRepository.deleteAll();
        bookRepository.deleteAll();
        memberRepository.deleteAll();
        userRepository.deleteAll();
        categoryRepository.deleteAll();

        Role adminRole = roleRepository.findByName(RoleType.ADMIN).orElseGet(() ->
                roleRepository.save(Role.builder().name(RoleType.ADMIN).build()));
        Role memberRole = roleRepository.findByName(RoleType.MEMBER).orElseGet(() ->
                roleRepository.save(Role.builder().name(RoleType.MEMBER).build()));

        userRepository.save(User.builder()
                .email("admin@test.com").password(passwordEncoder.encode("admin123"))
                .firstName("Admin").lastName("User").roles(Set.of(adminRole)).build());

        User memberUser = userRepository.save(User.builder()
                .email("member@test.com").password(passwordEncoder.encode("member123"))
                .firstName("Test").lastName("Member").roles(Set.of(memberRole)).build());

        Member member = memberRepository.save(Member.builder()
                .user(memberUser).membershipNumber("MEM-TEST-1")
                .joinedDate(LocalDate.now()).build());
        memberId = member.getId();

        Category category = categoryRepository.save(Category.builder().name("Test").description("Test").build());
        Book book = bookRepository.save(Book.builder()
                .title("Test Book").isbn("9780000000001").author("Test Author")
                .publisher("Test Publisher").category(category)
                .totalCopies(3).availableCopies(3).build());
        bookId = book.getId();

        adminToken = loginAndGetToken("admin@test.com", "admin123");
    }

    @Test
    void issueReturnAndRenewFlow() throws Exception {
        // Issue
        IssueBookRequest issue = new IssueBookRequest();
        issue.setMemberId(memberId);
        issue.setBookId(bookId);
        issue.setLoanDays(14);

        MvcResult issueResult = mockMvc.perform(post("/api/v1/borrows/issue")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(issue)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("ISSUED"))
                .andReturn();

        Long borrowId = objectMapper.readTree(issueResult.getResponse().getContentAsString())
                .path("data").path("id").asLong();

        Book afterIssue = bookRepository.findById(bookId).orElseThrow();
        assertEquals(2, afterIssue.getAvailableCopies());

        // Renew
        mockMvc.perform(post("/api/v1/borrows/" + borrowId + "/renew")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.renewalCount").value(1));

        // Return
        mockMvc.perform(post("/api/v1/borrows/" + borrowId + "/return")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("RETURNED"));

        Book afterReturn = bookRepository.findById(bookId).orElseThrow();
        assertEquals(3, afterReturn.getAvailableCopies());

        BorrowRecord record = borrowRecordRepository.findById(borrowId).orElseThrow();
        assertEquals(BorrowStatus.RETURNED, record.getStatus());
        assertNotNull(record.getReturnDate());
    }

    @Test
    void cannotIssueUnavailableBook() throws Exception {
        Book book = bookRepository.findById(bookId).orElseThrow();
        book.setAvailableCopies(0);
        bookRepository.save(book);

        IssueBookRequest issue = new IssueBookRequest();
        issue.setMemberId(memberId);
        issue.setBookId(bookId);

        mockMvc.perform(post("/api/v1/borrows/issue")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(issue)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void searchBooksByPublisher() throws Exception {
        mockMvc.perform(get("/api/v1/books")
                        .header("Authorization", "Bearer " + adminToken)
                        .param("publisher", "Test Publisher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content[0].publisher").value("Test Publisher"));
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest login = new LoginRequest();
        login.setEmail(email);
        login.setPassword(password);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
        return node.path("data").path("token").asText();
    }
}
