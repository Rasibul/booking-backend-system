import app from "./app";

const PORT = process.env.PORT;





async function main() {
    const server = app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });

}



main();