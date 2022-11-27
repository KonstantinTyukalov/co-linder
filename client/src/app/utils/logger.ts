// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Logger {
    public static SuccessfulQueryLog(content: any) {
        console.log('There was a successful request with an answer:', content);
    }
}
