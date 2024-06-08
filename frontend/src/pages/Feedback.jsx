import Slider from "../components/Feedback/Slider"

export default function Feedback() {
    return (
        <div className="h-[100vh] w-full flex flex-col items-center my-[50px]">
            <div className="flex flex-col p-4 items-center justify-between rounded-lg bg-slate-300 w-[40%] min-h-[300px] border border-solid border-gray-400">
                <div className="text-center">
                    <div className="flex flex-col justify-between gap-4">
                        <h1 className="font-bold text-2xl">Feedback Form</h1>
                        <p className="text-md">Please rate your experience:</p>
                    </div>
                </div>
                <div className="text-center">
                    <Slider />
                </div>
                <div className="text-center">
                    <button className="mt-3 py-2 px-5 text-lg font-bold bg-orange-400 rounded-lg">Submit</button></div>
            </div>
        </div>
    )
}