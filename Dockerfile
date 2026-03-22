# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM httpd:2.4-alpine

# Copy built files to Apache htdocs
COPY --from=build /app/dist/ /usr/local/apache2/htdocs/

# Copy .htaccess for routing
COPY .htaccess /usr/local/apache2/htdocs/

# Enable mod_rewrite and AllowOverride in httpd.conf
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
    -e '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' \
    /usr/local/apache2/conf/httpd.conf

EXPOSE 80
