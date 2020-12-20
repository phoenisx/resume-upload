# Resumable Uploads

A POC for file uploads in chunk, that are network fail safe,
provide retries on chunk upload failures and allows the
user to play/pause the upload whenever they want!!

Uses [ResumableJS](https://github.com/23/resumable.js/), on
client to upload files in chunk. The concept is quite simple,
ResumableJS uploads files in chunks, and Server needs to await
chunk upload requests and save them into one single big
file.

## Development

### Run Server:

```sh
# run following command, to listen to file changes
> yarn dev

# run following to start server
> yarn start
```

### Run Client:

```sh
> cd ./client

> yarn start
```
