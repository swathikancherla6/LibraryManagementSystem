# Open in IntelliJ IDEA

## File to open

Open this file in IntelliJ:

```
LibraryManagement/pom.xml
```

Full path on your machine:

```
/Users/swaroop/Desktop/LibraryManagement/pom.xml
```

## Steps

1. Open **IntelliJ IDEA**
2. **File → Open…**
3. Select `pom.xml` in the `LibraryManagement` folder (the **root** one, not the one inside `backend/`)
4. Choose **Open as Project**
5. When prompted, click **Trust Project**
6. Wait for Maven to import dependencies (bottom-right progress bar)

## Run the backend

1. Open `backend/library-management-api/src/main/java/com/library/management/LibraryManagementApplication.java`
2. Click the green **Run** icon next to `main`
3. Ensure MySQL is running (see root `README.md`)

## Frontend (optional in IntelliJ)

IntelliJ Ultimate can open the React app:

1. **File → New → Module from Existing Sources…**
2. Select `frontend/library-management-ui/package.json`
3. Run `npm install` in the terminal, then `npm run dev`

Or use VS Code / terminal for the frontend only.

## JDK

- Set **Project SDK** to **Java 21**  
  **File → Project Structure → Project → SDK**

## Demo login

- admin@library.com / admin123
