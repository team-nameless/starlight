import { prisma } from "../prisma/client";

async function main() {
    const tracks = [
        {
            id: 586954,
            title: "Virtual Paradise (Cut Ver.)",
            artist: "AK X LYNX feat. Veela",
            source: "N/A",
            noteDesigner: "Hydria",
            difficulty: 2.7,
            difficultyFavorText: "HD",
            duration: 88276,
            dataFileLocation: "static/586954/586954.json",
            backgroundFileLocation: "static/586954/Bgparadise.jpg",
            audioFileLocation: "static/586954/AK x LYNX ft. Veela - Virtual Paradise.mp3"
        },
        {
            id: 2128243,
            title: "Uchiage Hanabi (Cut Ver.)",
            artist: "DAOKO x Kenshi Yonezu",
            source: "打ち上げ花火、下から見るか？横から見るか？",
            noteDesigner: "Sympho",
            difficulty: 1.1,
            difficultyFavorText: "EZ",
            duration: 87500,
            dataFileLocation: "static/2128243/2128243.json",
            backgroundFileLocation: "static/2128243/bg.jpg",
            audioFileLocation: "static/2128243/audio.mp3"
        },
        {
            id: 2211127,
            title: "Ichiban Kagayaku Hoshi",
            artist: "Alya (CV: Uesaka Sumire)",
            source: "時々ボソッとロシア語でデレる隣のアーリャさん",
            noteDesigner: "keksikosu",
            difficulty: 1.4,
            difficultyFavorText: "EZ",
            duration: 86219,
            dataFileLocation: "static/2211127/2211127.json",
            backgroundFileLocation: "static/2211127/3.jpg",
            audioFileLocation: "static/2211127/audio.ogg"
        },
        {
            id: 2212131,
            title: "Kawaikute Gomen",
            artist: "Alya (CV: Uesaka Sumire)",
            source: "時々ボソッとロシア語でデレる隣のアーリャさん",
            noteDesigner: "Damaree",
            difficulty: 2.1,
            difficultyFavorText: "NM",
            duration: 88518,
            dataFileLocation: "static/2212131/2212131.json",
            backgroundFileLocation: "static/2212131/alya.jpg",
            audioFileLocation: "static/2212131/chuowo.ogg"
        }
    ];

    for (const track of tracks) {
        await prisma.track.upsert({
            where: { id: track.id },
            update: {},
            create: track
        });
    }
}

main()
    .then()
    .catch(err => {
        throw err;
    });
