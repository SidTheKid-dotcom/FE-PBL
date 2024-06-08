import { useEffect, useMemo, useState } from "react";

export default function Reaction({ value }) {

    const coloredEmojis = useMemo(() => ['😣', '😒', '😊', '😁'], []);
    const greyEmojis = useMemo(() => ['*', '*', '*', '*'], []);

    const [displayEmojis, setDisplayEmojis] = useState(greyEmojis)

    useEffect(() => {

        const index = Math.floor((value-1) / 25);

        const newDisplayEmojis = [...greyEmojis];
        newDisplayEmojis[index] = coloredEmojis[index];

        setDisplayEmojis(newDisplayEmojis);

    }, [value])

    return <div>{displayEmojis}</div>
}
