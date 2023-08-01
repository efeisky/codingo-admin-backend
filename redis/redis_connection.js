const redis = require('redis');
const {getExpiryTime, calculateRemainingTime} = require('../security/expiredTime');
const CreateToken = require('../security/token');

async function setValue(key, value, createToken, token) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    await client.connect();
    if (createToken) {
        await setToken(client, value.ipAdress, 5,token);
    }
    await client.set(key, JSON.stringify(value));
    
    await client.disconnect();
}
async function setToken(client, key, minute, token) {
    const token_data = {
        token: token,
        expired_time: getExpiryTime(minute),

    };
    await client.set(key, JSON.stringify(token_data));
}
async function getOTP(key) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    try {
        await client.connect();

        const isAvailable = await client.exists(key);

        if (isAvailable) {
            const result = JSON.parse(await client.get(key));
            await client.disconnect();
    
            return {
                isExpired: new Date() <= new Date(result.expired_time),
                otp: result.key,
                ip: result.ipAdress
            };
        } else {
            await client.disconnect();
            return {
                isExpired: false,
                otp: null,
                ip: null
            };
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        await client.disconnect();
        throw error;
    }
}
async function getToken(key) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    try {
        await client.connect();

        const isAvailable = await client.exists(key);
        if (isAvailable) {
            const result = JSON.parse(await client.get(key));
    
            await client.disconnect();
    
            return {
                isExpired : new Date() <= new Date(result.expired_time),
                token : result.token
            };
            
        } else {
            await client.disconnect();
            return {
                isExpired: false,
                token: null
            };
            
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        await client.disconnect();
        throw error;
    }
}
async function deleteValue(id, ip) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    try {
        await client.connect();

        const otpExists = await client.exists(id);
        const loginTokenExists = await client.exists(ip);

        if (otpExists) {
            await client.del(id);
        }

        if (loginTokenExists) {
            await client.del(ip);
        }

        await client.disconnect();

        return {
            delete_status: true
        };
    } catch (error) {
        console.error('Error occurred:', error.message);
        await client.disconnect();
        throw error;
    }
}
async function CreatePermanentToken(id, ip) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    try {
        await client.connect();

        const one_day_token = CreateToken(128);
        const token_data = {
            token: one_day_token,
            user_id: id,
            expired_time: getExpiryTime(720),
            
        };
        await client.set(ip, JSON.stringify(token_data));

        await client.disconnect();

        return {
            is_created : true,
            created_token: one_day_token
        };
    } catch (error) {
        console.error('Error occurred:', error.message);
        await client.disconnect();
        throw error;
    }
}
async function takePermanentToken(ip, token) {
    const redissUrl = process.env.REDIS_DATABASE_URL ?? (() => { throw new Error('REDIS_DATABASE_URL is not defined!'); })();
    const client = redis.createClient({
        url: redissUrl
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    
    try {
        await client.connect();
        const isAvailable = await client.exists(ip);
        if (isAvailable) {
            const result = JSON.parse(await client.get(ip));
    
            await client.disconnect();
    
            return {
                status : new Date() <= new Date(result.expired_time) && token === result.token,
                id : result.user_id,
                tokenRemaining : new Date() <= new Date(result.expired_time) ? calculateRemainingTime(result.expired_time) : null
            };
            
        } else {
            await client.disconnect();
            return {
                status : false,
                id: null,
                tokenRemaining: null
            };
            
        }
        
    } catch (error) {
        console.error('Error occurred:', error.message);
        await client.disconnect();
        throw error;
    }
}
module.exports = {
    setValue,
    getToken,
    getOTP,
    deleteValue,
    CreatePermanentToken,
    takePermanentToken
};