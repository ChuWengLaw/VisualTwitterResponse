From node:erbium

# Copy app source
COPY ./src /src

# Set work directory to /src
WORKDIR /src

# Expose port to outside world
EXPOSE 3000

# Start command as per package.json
CMD ["npm", "start"]
