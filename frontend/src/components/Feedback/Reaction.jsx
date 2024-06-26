import { useEffect, useMemo, useState } from "react";

export default function Reaction({ value }) {

    const coloredEmojis = useMemo(() => ['😣', '😊', '😁', '😎'], []);
    const greyEmojis = useMemo(() => ['•', '•', '•', '•'], []);

    const [displayEmojis, setDisplayEmojis] = useState(greyEmojis)

    useEffect(() => {

        const index = Math.floor((value - 1) / 25);

        const newDisplayEmojis = [...greyEmojis];
        newDisplayEmojis[index] = coloredEmojis[index];

        setDisplayEmojis(newDisplayEmojis);

    }, [value])

    return <div className="flex flex-row justify-around w-[300px]">
    {
        displayEmojis.map((emoji, index) => (
            <span key={index} className="mx-1 text-2xl">{emoji}</span>
        ))
    }
    </div>
}
