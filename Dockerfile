FROM eclipse-temurin:23-jdk

# Create app directory
WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
