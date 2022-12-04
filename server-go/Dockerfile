FROM golang:1.19

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

RUN mkdir /usr/local/bin/app

COPY . .
RUN go build -v -o /usr/local/bin/app ./...

ENTRYPOINT ["/usr/local/bin/app/cmd", "serve"]

CMD ["--http=0.0.0.0:3000"]
