export interface IAgent {
    name: string,
    email: string,
    password: string,
    countryCode: string,
    phoneNumber: string
}


export interface ISignup {
    name: string,
    email: string,
    password: string
}

export interface ILogin {
    email: string,
    password: string
}
export interface Task {
    firstName: string;
    phone: string;
    notes: string;
    _id: string
}
export interface IAgentDetails {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
    password: string;
    createdBy: string;
    assignedTask: Task[]
}

export interface File {
    _id: string;
    url: string;
    publicId: string;
    status: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string
}

export interface IUser {
    _id: string;
    name: string;
    email: string;
    agents: IAgentDetails[];
    files: File[]
}
