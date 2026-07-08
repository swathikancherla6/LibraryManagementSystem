package com.library.management.config;

import com.library.management.entity.*;
import com.library.management.enums.BorrowStatus;
import com.library.management.enums.RoleType;
import com.library.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData() {
        return args -> {
            for (RoleType roleType : RoleType.values()) {
                roleRepository.findByName(roleType).orElseGet(() ->
                        roleRepository.save(Role.builder().name(roleType).build()));
            }

            Role adminRole = roleRepository.findByName(RoleType.ADMIN).orElseThrow();
            Role librarianRole = roleRepository.findByName(RoleType.LIBRARIAN).orElseThrow();
            Role memberRole = roleRepository.findByName(RoleType.MEMBER).orElseThrow();

            if (!userRepository.existsByEmail("admin@library.com")) {
                userRepository.save(User.builder()
                        .email("admin@library.com")
                        .password(passwordEncoder.encode("admin123"))
                        .firstName("System").lastName("Admin").phone("9999999999")
                        .roles(Set.of(adminRole)).build());

                userRepository.save(User.builder()
                        .email("librarian@library.com")
                        .password(passwordEncoder.encode("librarian123"))
                        .firstName("Jane").lastName("Librarian").phone("8888888888")
                        .roles(Set.of(librarianRole)).build());

                User memberUser = userRepository.save(User.builder()
                        .email("member@library.com")
                        .password(passwordEncoder.encode("member123"))
                        .firstName("John").lastName("Member").phone("7777777777")
                        .roles(Set.of(memberRole)).build());

                memberRepository.save(Member.builder()
                        .user(memberUser).membershipNumber("MEM-0001")
                        .address("123 Library Street").membershipType("STANDARD")
                        .joinedDate(LocalDate.now().minusMonths(6)).build());
            }

            if (bookRepository.countByActiveTrue() >= 50) return;

            Map<String, Category> categories = seedCategories();
            List<Book> books = seedBooks(categories);
            List<Member> members = seedMembers(memberRole);
            seedBorrowHistory(members, books);
        };
    }

    private Map<String, Category> seedCategories() {
        String[] names = {
                "Programming", "Database", "Networking", "AI", "Machine Learning",
                "Operating Systems", "Cyber Security", "Web Development", "Cloud Computing"
        };
        Map<String, Category> map = new LinkedHashMap<>();
        for (String name : names) {
            map.put(name, categoryRepository.findByName(name).orElseGet(() ->
                    categoryRepository.save(Category.builder().name(name).description(name + " books").build())));
        }
        return map;
    }

    private List<Book> seedBooks(Map<String, Category> categories) {
        record BookSeed(String title, String isbn, String author, String cat, int copies, int year) {}
        BookSeed[] seeds = {
                new BookSeed("Clean Code", "9780132350884", "Robert C. Martin", "Programming", 5, 2008),
                new BookSeed("Effective Java", "9780134685991", "Joshua Bloch", "Programming", 4, 2017),
                new BookSeed("Head First Java", "9780596009205", "Kathy Sierra", "Programming", 6, 2005),
                new BookSeed("Java: The Complete Reference", "9781260440232", "Herbert Schildt", "Programming", 3, 2021),
                new BookSeed("Design Patterns", "9780201633610", "Gang of Four", "Programming", 4, 1994),
                new BookSeed("Introduction to Algorithms", "9780262046305", "Cormen et al.", "Programming", 3, 2022),
                new BookSeed("The Pragmatic Programmer", "9780135957059", "David Thomas", "Programming", 5, 2019),
                new BookSeed("Refactoring", "9780134757599", "Martin Fowler", "Programming", 3, 2018),
                new BookSeed("Spring in Action", "9781617297571", "Craig Walls", "Programming", 4, 2021),
                new BookSeed("Database System Concepts", "9780078022159", "Silberschatz", "Database", 4, 2019),
                new BookSeed("SQL Performance Explained", "9783950307825", "Markus Winand", "Database", 3, 2012),
                new BookSeed("Database Internals", "9781492040347", "Alex Petrov", "Database", 2, 2019),
                new BookSeed("Designing Data-Intensive Applications", "9781449373320", "Martin Kleppmann", "Database", 5, 2017),
                new BookSeed("PostgreSQL: Up and Running", "9781491961966", "Regina Obe", "Database", 3, 2017),
                new BookSeed("MySQL Cookbook", "9781449374020", "Paul DuBois", "Database", 4, 2014),
                new BookSeed("Computer Networks", "9780136681557", "Andrew Tanenbaum", "Networking", 4, 2020),
                new BookSeed("TCP/IP Illustrated", "9780321336316", "W. Richard Stevens", "Networking", 3, 2011),
                new BookSeed("Network Warrior", "9781449387884", "Gary Donahue", "Networking", 2, 2011),
                new BookSeed("Networking All-in-One", "9781119726834", "Doug Lowe", "Networking", 5, 2021),
                new BookSeed("Artificial Intelligence: A Modern Approach", "9780134610993", "Russell & Norvig", "AI", 3, 2020),
                new BookSeed("Deep Learning", "9780262035613", "Ian Goodfellow", "AI", 2, 2016),
                new BookSeed("AI: A Guide for Thinking Humans", "9780374257839", "Melanie Mitchell", "AI", 4, 2019),
                new BookSeed("Life 3.0", "9781101946596", "Max Tegmark", "AI", 3, 2017),
                new BookSeed("Hands-On Machine Learning", "9781098125974", "Aurélien Géron", "Machine Learning", 5, 2022),
                new BookSeed("Pattern Recognition and ML", "9780387310732", "Christopher Bishop", "Machine Learning", 3, 2006),
                new BookSeed("Machine Learning Yearning", "9781732265108", "Andrew Ng", "Machine Learning", 4, 2018),
                new BookSeed("The Hundred-Page ML Book", "9781999579517", "Andriy Burkov", "Machine Learning", 6, 2019),
                new BookSeed("Operating System Concepts", "9781119800361", "Silberschatz", "Operating Systems", 4, 2021),
                new BookSeed("Modern Operating Systems", "9780133591620", "Andrew Tanenbaum", "Operating Systems", 3, 2014),
                new BookSeed("Operating Systems: Three Easy Pieces", "9781985086593", "Remzi Arpaci-Dusseau", "Operating Systems", 5, 2018),
                new BookSeed("The Linux Programming Interface", "9781593272203", "Michael Kerrisk", "Operating Systems", 2, 2010),
                new BookSeed("The Web Application Hacker's Handbook", "9781118026472", "Dafydd Stuttard", "Cyber Security", 3, 2011),
                new BookSeed("Metasploit: The Penetration Tester's Guide", "9781593272883", "David Kennedy", "Cyber Security", 2, 2011),
                new BookSeed("Cybersecurity Essentials", "9781119362395", "Charles Brooks", "Cyber Security", 4, 2018),
                new BookSeed("Hacking: The Art of Exploitation", "9781593271442", "Jon Erickson", "Cyber Security", 3, 2008),
                new BookSeed("Eloquent JavaScript", "9781593279509", "Marijn Haverbeke", "Web Development", 5, 2018),
                new BookSeed("You Don't Know JS", "9781491924464", "Kyle Simpson", "Web Development", 4, 2017),
                new BookSeed("Learning React", "9781492051721", "Alex Banks", "Web Development", 5, 2020),
                new BookSeed("Full Stack React", "9780998547743", "Anthony Accomazzo", "Web Development", 3, 2017),
                new BookSeed("CSS Secrets", "9781449372637", "Lea Verou", "Web Development", 4, 2015),
                new BookSeed("Cloud Native Patterns", "9781617294297", "Cornelia Davis", "Cloud Computing", 3, 2019),
                new BookSeed("AWS Certified Solutions Architect", "9781119138556", "Ben Piper", "Cloud Computing", 4, 2020),
                new BookSeed("Kubernetes Up and Running", "9781492046539", "Kelsey Hightower", "Cloud Computing", 5, 2022),
                new BookSeed("Site Reliability Engineering", "9781491973897", "Google SRE Team", "Cloud Computing", 3, 2016),
                new BookSeed("The Phoenix Project", "9781942788294", "Gene Kim", "Cloud Computing", 6, 2018),
                new BookSeed("Domain-Driven Design", "9780321125217", "Eric Evans", "Programming", 3, 2003),
                new BookSeed("Code Complete", "9780735619678", "Steve McConnell", "Programming", 4, 2004),
                new BookSeed("Structure and Interpretation of Programs", "9780262510875", "Abelson & Sussman", "Programming", 2, 1996),
                new BookSeed("Compilers: Principles and Practice", "9781429272396", "Alfred Aho", "Programming", 2, 2006),
                new BookSeed("NoSQL Distilled", "9780321826626", "Martin Fowler", "Database", 4, 2012),
                new BookSeed("Redis in Action", "9781617290855", "Josiah Carlson", "Database", 3, 2013),
                new BookSeed("Zero Trust Networks", "9781491962190", "Evan Gilman", "Cyber Security", 3, 2017),
                new BookSeed("Practical Malware Analysis", "9781593272906", "Michael Sikorski", "Cyber Security", 2, 2012),
                new BookSeed("Generative Deep Learning", "9781098125356", "David Foster", "AI", 3, 2022),
        };

        List<Book> saved = new ArrayList<>();
        for (BookSeed s : seeds) {
            if (bookRepository.existsByIsbn(s.isbn())) continue;
            Book book = bookRepository.save(Book.builder()
                    .title(s.title()).isbn(s.isbn()).author(s.author())
                    .publisher(publisherForCategory(s.cat()))
                    .coverImageUrl("https://covers.openlibrary.org/b/isbn/" + s.isbn() + "-M.jpg")
                    .description("A comprehensive guide to " + s.title())
                    .category(categories.get(s.cat()))
                    .totalCopies(s.copies()).availableCopies(s.copies())
                    .publishedYear(s.year()).build());
            saved.add(book);
        }
        saved.addAll(bookRepository.findAll().stream().filter(Book::getActive).toList());
        return saved;
    }

    private List<Member> seedMembers(Role memberRole) {
        List<Member> members = new ArrayList<>(memberRepository.findAll());
        String[][] memberData = {
                {"alice@library.com", "Alice", "Johnson", "MEM-0002", "PREMIUM"},
                {"bob@library.com", "Bob", "Smith", "MEM-0003", "STANDARD"},
                {"carol@library.com", "Carol", "Williams", "MEM-0004", "STANDARD"},
                {"david@library.com", "David", "Brown", "MEM-0005", "PREMIUM"},
                {"emma@library.com", "Emma", "Davis", "MEM-0006", "STANDARD"},
                {"frank@library.com", "Frank", "Miller", "MEM-0007", "STANDARD"},
                {"grace@library.com", "Grace", "Wilson", "MEM-0008", "PREMIUM"},
        };

        for (String[] data : memberData) {
            if (userRepository.existsByEmail(data[0])) continue;
            User user = userRepository.save(User.builder()
                    .email(data[0]).password(passwordEncoder.encode("member123"))
                    .firstName(data[1]).lastName(data[2]).phone("5550000000")
                    .roles(Set.of(memberRole)).build());
            members.add(memberRepository.save(Member.builder()
                    .user(user).membershipNumber(data[3])
                    .address("456 Reader Lane").membershipType(data[4])
                    .joinedDate(LocalDate.now().minusMonths(new Random().nextInt(12) + 1)).build()));
        }
        return members;
    }

    private String publisherForCategory(String category) {
        return switch (category) {
            case "Programming" -> "Addison-Wesley";
            case "Database" -> "McGraw-Hill";
            case "Networking" -> "Pearson";
            case "AI", "Machine Learning" -> "MIT Press";
            case "Operating Systems" -> "Wiley";
            case "Cyber Security" -> "No Starch Press";
            case "Web Development" -> "O'Reilly Media";
            case "Cloud Computing" -> "Manning Publications";
            default -> "Technical Publishing";
        };
    }

    private void seedBorrowHistory(List<Member> members, List<Book> books) {
        if (borrowRecordRepository.count() > 0) return;

        LocalDate today = LocalDate.now();
        Random random = new Random(42);

        for (int i = 0; i < 30; i++) {
            Member member = members.get(random.nextInt(members.size()));
            Book book = books.get(random.nextInt(books.size()));
            if (book.getAvailableCopies() <= 0) continue;

            LocalDate issueDate = today.minusDays(random.nextInt(60) + 1);
            int loanDays = 14;
            LocalDate dueDate = issueDate.plusDays(loanDays);
            BorrowStatus status;
            LocalDate returnDate = null;

            int scenario = random.nextInt(10);
            if (scenario < 4) {
                status = BorrowStatus.RETURNED;
                returnDate = dueDate.minusDays(random.nextInt(5));
                if (returnDate.isBefore(issueDate)) returnDate = dueDate;
            } else if (scenario < 7) {
                status = BorrowStatus.ISSUED;
                book.setAvailableCopies(book.getAvailableCopies() - 1);
            } else {
                status = BorrowStatus.OVERDUE;
                dueDate = today.minusDays(random.nextInt(10) + 1);
                book.setAvailableCopies(book.getAvailableCopies() - 1);
            }

            borrowRecordRepository.save(BorrowRecord.builder()
                    .member(member).book(book)
                    .issueDate(issueDate).dueDate(dueDate)
                    .returnDate(returnDate).status(status)
                    .renewalCount(random.nextInt(2)).build());
            bookRepository.save(book);
        }
    }
}
