/* While we talk about any algo or concept like ratelimter where the most confusion part is creation of bucket. While we tell the bucket then which data structure to be consider for this. Because that should be aligned with the requirment. 
So, there are many options like array, queue, stack, map, set, linked list. But there are trade off for each data sturture so we have to alligne that to that requirment. 

requirment: 
1. Bucket should be holding the user details and the token which is have like userId, token, last_time_consumed.
2. Refiller which should be also pickup which also contains the time when to refiller the bucket. 
3. Timning when to be filling like what rate to be picked for filling the bucket. 
4. When we choose array as the bucket the it look like [{user_123, 1, 2026-09-28}, ...], the tradeoff are searching will be he issue. 
5. Whne we choose queue then that can be the worst decision because it is used whne firt in firtout but we are not here for that we are here for just storing or mapping the user with there token so no use. 
6. linked list this is also worst because we dont wanted to link any node with other node. 
7. Set is used to only give the values but we also needed the key to that mapped with that values. 
8. map is the one which is used inside this and we are using the map has the bucket of buckets where we are storing the all the users inside the big objct. so searhcing or updating the object will be more easer and more simpler and fast. 


*/

class TokenBucket {
  constructor({ capacity = 10, refilling = 2 } = {}) {
    this.capacity = capacity;
    this.refilling = refilling;
    this.bucket = new Map();
  }

  tryconsume(key, cost = 1) {
    const now = Date.now();
    console.log("timestamp:", now);
    let bucket = this.bucket.get(key);
    console.log("bucket:", bucket);

    if (!bucket) {
      bucket = { token: this.capacity, lastrefill: now };
      console.log("bucket1:", bucket);
      this.bucket.set(key, bucket);
      console.log("bucket2:", this.bucket.set(key, bucket));
    } else {
      const elaspedSeconds = (now - bucket.lastrefill) / 1000;
      console.log("elaspedSeconds:", elaspedSeconds);
      const tokenToAdd = elaspedSeconds * this.refilling;
      console.log("tokenToAdd:", tokenToAdd);
      bucket.token = Math.min(this.capacity, bucket.token + tokenToAdd);
      console.log("bucket.tokens:", bucket.token);
      bucket.lastrefill = now;
      console.log("bucket.lastrefill", bucket.lastrefill);
    }
    if (bucket.token >= cost) {
      bucket.token -= cost;
      console.log("bucket.tokens", bucket.token);
      return { allowed: true, remaning: Math.floor(bucket.token) };
    }
    return { allowed: false, remaning: Math.floor(bucket.token) };
  }
}

const limiter = new TokenBucket({ capacity: 3, refilling: 1 });

console.log(limiter.tryconsume("user_123"));
console.log(limiter.tryconsume("user_123"));
console.log(limiter.tryconsume("user_123"));
console.log(limiter.tryconsume("user_123"));
