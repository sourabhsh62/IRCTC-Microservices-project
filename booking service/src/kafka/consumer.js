const {Kafka}=require("kafkasjs");
const kafka= new Kafka({clientId:"irctc-app",brokers:["localhost:9092"]});
const consumer= kafka.consumer({groupId:"email-group"});
async function run(){
    await consumer.connect();
    await consumer.subscribe({topic:"payment-success"})
    await consumer.run({eachMessage:async ({message})=>{
        const data=JSON.parse(message.value.toString());
        console.log(data);
    }})
}
run();