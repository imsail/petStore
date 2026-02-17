# Stage 1: Build Angular frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml ./
COPY backend/pom.xml backend/
COPY frontend/pom.xml frontend/
# Download dependencies first (layer caching)
RUN mvn dependency:go-offline -pl backend -am -B 2>/dev/null || true
COPY backend/src backend/src
# Copy Angular build output into static resources
COPY --from=frontend-build /app/frontend/dist/frontend/browser/ backend/src/main/resources/static/
# Build backend JAR, skip frontend module and tests
RUN mvn package -pl backend -DskipTests -B

# Stage 3: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/backend/target/petstore-backend-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
