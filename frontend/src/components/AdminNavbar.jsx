export default function AdminNavbar() {
    return (
        <section className="p-4 grid grid-cols-12 gap-10 bg-slate-100 font-bold text-gray-700">

            <figure className="flex justify-center col-span-2">
                <img title="Company logo" alt="Company Logo"></img>
            </figure>

            <div className="flex justify-center col-span-8">Today's Menu</div>

            <div className="flex justify-center col-span-2">
                <figure>
                    <img title="User Picture" alt="User Picture"></img>
                </figure>
            </div>

        </section>
    )
}