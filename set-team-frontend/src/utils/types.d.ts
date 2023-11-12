// User object from dynamoDB
interface User {
    PK: string;
    SK: string;
    name: string;
    surname: string;
    tags: string[];
}
// Project object from dynamoDB
interface Project {
    PK: string;
    SK: string;
    name: string;
    ownerId: string;
    projDates: string[];
    projTeam: string[];
    projBgColor: string;
}
