export default function LogoutCard() {

    return (
        <div className="relative">
            <div className="absolute z-999 m-4 p-4 min-w-[40%] min-h-[100px] top-0 bg-slate-100 text-black font-bold rounded-lg flex flex-col justify-center items-center">
                <h1>Logged out successfully</h1>
                <div className="relative m-6 p-6 min-w-[100px] min-h-[100px] bg-green-400 rounded-full">
                    <img src="/check-solid.svg" alt="Tick"></img>
                </div>
                <button onClick={backToHome} className="m-4 p-1 w-[40%] rounded-lg bg-orange-400">Back</button>
            </div>
        </div>
    )
}