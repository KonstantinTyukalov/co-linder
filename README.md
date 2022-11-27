# match-shared-app

Akvelon Hackaton 2022 application to find co-living place.

### Start back-end

Database dump (from Hackaton 2022/11/26 end):
- Go to "server-go" folder and unzip pb_data.zip here.

Using https://github.com/codegangsta/gin:
- Run `go install github.com/codegangsta/gin@latest`.
- Make sure that $GOPATH/bin in PATH environment variable to have access to `gin` (it is usually $HOME/go/bin).
- Go to "server-go" in console.
- Run `gin --appPort 8090 run serve`. After "[gin] Build finished" (takes up to a minute first time) it should provide 2 URL-s to work with.
- Open Admin part at http://localhost:3000/_/#/login and user credentials alexander.makarov@akvelon.com x67LmrXVCDdUNWn

Direct start (won't work with front-end due to different ports used):

- In "server-go" folder run `go run main.go serve --http="<yourPort>:3000"`. example port - 172.16.101.93

# Start front-end

- Go to "client" folder.
- `npm install`
- `npm start`
- Go to localhost:4200/login

### Speach

0-30
Let's imagine you've arrived into new country to live and work here.
The most worried thing for you is probably to find a place to live.

30+
Fortunatelly friend of mine suggested me to user Co-living Crew application. So let's give it a try.
It asks some information about me to share more details to other seekers and allow to apply relevant filters.
Ok, I want to find a place in Yerevan. Also I don't want it to be very expensive and 

Let's discuss how we will check in into our new shared flat. Hurray!
