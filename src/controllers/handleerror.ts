import {Request, Response} from 'express';

export default class HandleError{
    static genericError(req : Request, res : Response){
    return res.status(404).json({
        msg: "Resource not found"
      })
    }  
} 

