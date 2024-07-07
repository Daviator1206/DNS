const dgram = require('node:dgram');
const dnsPacket = require("dns-packet")
const server = dgram.createSocket('udp4')
const port = 53

const db = {
    "google.com" : {type: 'A',
        data: '1.2.3.4'
    },
    "blog.google.com": {
        type: 'CNAME',
        data: 'hashnode.network'
    }
}

server.on('message', (msg, rinfo)=>{
    const incomingReq = dnsPacket.decode(msg)
    const ipfromdb = db[incomingReq.questions[0].name]
    const ans = dnsPacket.encode({
        type: 'response',
        id: incomingReq.id,
        questions: incomingReq.questions,
        answers: [{
            type: ipfromdb.type,
            name: incomingReq.questions[0].name,
            data: ipfromdb.data
        }]
    })
    server.send(ans, rinfo.port), rinfo.address

})


server.bind(port, ()=>{
    console.log("listening on 53")
})