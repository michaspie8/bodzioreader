import { Book } from "../db/db";

export const exampleWordsArray = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac iaculis orci, eget placerat risus. Praesent et cursus arcu, eu congue metus. Donec vulputate tempor arcu et vulputate. Nullam aliquet orci nec laoreet fermentum. Cras quis nunc facilisis lacus aliquam suscipit. Curabitur vel ipsum in nisi ultrices auctor vitae in dui. Vestibulum aliquam, lacus sit amet mollis fermentum, justo justo pharetra arcu, sit amet lobortis dui sapien eu lorem. Suspendisse efficitur quam et odio vestibulum volutpat. Nunc a mollis justo. Duis feugiat mauris tellus, id posuere nulla bibendum in. In sed rhoncus felis. Quisque molestie turpis in augue convallis eleifend. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor dui et erat tincidunt porta. Integer euismod semper ipsum vitae porta. Suspendisse pharetra placerat consectetur. Sed et elementum leo, ut mattis ante. Phasellus dapibus leo scelerisque placerat porta. Donec sit amet risus non justo varius convallis. Phasellus eleifend dui in. ".split(" ");

export const exampleBooks: Book[] = [
    {
        id: 1,
        title: "Example Book 1",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
            { words: exampleWordsArray.slice(100, 150) },
        ],
    },
    {
        id: 2,
        title: "Example Book 2",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(100, 150) },
        ],
    },
    {
        id: 3,
        title: "Example Book 3",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
        ],
    },
    {
        id: 4,
        title: "Example Book 4",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
            { words: exampleWordsArray.slice(100, 150) },
        ],
    },
    {
        id: 5,
        title: "Example Book 5",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(100, 150) },
        ],
    },
    {
        id: 6,
        title: "Example Book 6",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
        ],
    },
    {
        id: 7,
        title: "Example Book 7",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
        ],
    },
    {
        id: 8,
        title: "Example Book 8",
        lastEdited: new Date(),
        pages: [
            { words: exampleWordsArray.slice(0, 50) },
            { words: exampleWordsArray.slice(50, 100) },
        ],
    },
]