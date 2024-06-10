import { Request} from "express";
import { IUser } from "../models/user.model";

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}

/*
=> declare global { } is used to extend global objects in TypeScript.
=> namespace Express { } is a namespace declaration that extends the Express namespace in TypeScript.
=> interface Request { } is an interface declaration that extends the existing Request interface in the express library.

With this extension, when you use req.user in your Express route handlers, TypeScript will recognize it as a property that can hold an object conforming to the IUser interface. This is often used to store user information, such as details of the currently authenticated user, in the request object for easy access in route handlers.
*/