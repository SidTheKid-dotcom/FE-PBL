export default function Overview() {

    const triangleStyle = {
        backgroundImage: 'linear-gradient(to bottom right, rgb(254 202 202) 50%, rgb(185 28 28) 50%)'
    };

    return (
        <div className="grid grid-cols-12 h-[100vh] w-full">
            <section className="col-span-5 bg-red-200"></section>
            <section className="col-span-2"  style={triangleStyle}></section>
            <section className="col-span-5 bg-red-700"></section>
        </div>
    )
}