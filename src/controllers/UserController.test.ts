import { UserData } from "types/auth"
import {encrypt_password,decrypt_password, register, setupMongo, login, toggleTheme, removeCity, addCity, removeUser} from "./UserController"

setupMongo()

test("password encryption",()=>{
    const encryptedPass = encrypt_password("test")
    expect(decrypt_password(encryptedPass)).toBe("test")
})

const test_user:UserData = {
    username:"test",
    password:"test",
    email:"test",
    cities:[],
    isInLightMode:true
}

test("mongodb connection", async ()=>{
    expect((await setupMongo())).toBe(true)
})

test("user registeration", async ()=>{
    const req = { body:{...test_user}}
    expect((await register(req)).code).toBe(200)
})

test("user registeration with same email", async ()=>{
    const req = { body:{...test_user}}
    expect((await register(req)).code).toBe(406)
})

test("user login", async ()=>{
    const req = { body:{...test_user}}
    expect((await login(req)).code).toBe(200)
})

test("toogle theme", async ()=>{
    const req = { session:{user:{...test_user}}}
    expect((await toggleTheme(req)).code).toBe(200)
})

test("add city", async ()=>{
    const req = { body:{city:2968815},session:{user:{...test_user}}}
    expect((await addCity(req)).code).toBe(200)
})

test("remove city", async ()=>{
    const req = { body:{city:2968815},session:{user:{...test_user}}}
    expect((await removeCity(req)).code).toBe(200)
})

test("remove a city who isn't in the list", async ()=>{
    const req = { body:{city:2968815},session:{user:{...test_user}}}
    expect((await removeCity(req)).code).toBe(404)
})

test("remove user", async ()=>{
    const req = { session:{user:{...test_user}}}
    expect((await removeUser(req)).code).toBe(200)
})

