
export type AppMessageType = {
    type:'error' | 'success' | 'warning' | 'alert',
    message?:string,
    text?:string,
    id?: string | number
};
