const express =  require("express");
const rootRouter =  require("./routes/index");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1", rootRouter);


const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is up and running on port ${PORT}`);
});