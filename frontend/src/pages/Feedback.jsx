import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "../components/Feedback/Slider";
import LoadingSpinner from "../assets/animations/LoadingSpinner";

export default function Feedback() {
    const [value, setValue] = useState(75); // Initial value
    const [feedbackText, setFeedbackText] = useState('');
    const [loading, setLoading] = useState(true);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [isEditReq, setIsEditReq] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const [displayMessage,] = useState('Max Character Limit Reached');
    const maxChars = 500;

    useEffect(() => {
        const getPrevReview = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/v1/user/feedback`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status === 404) {
                    setLoading(false);
                    return;
                }

                setTimeout(() => {
                    console.log(response.data);
                    setLoading(false);
                    setAlreadySubmitted(true);
                    setIsEditReq(true);
                    setValue(response.data.feedback[0].rating);
                    setFeedbackText(response.data.feedback[0].feedback);
                }, 300);

            } catch (error) {
                setLoading(false);
                console.error('Error fetching feedback:', error.message);
            }
        }

        getPrevReview();
    }, []);

    const handleFeedbackChange = (event) => {
        const inputText = event.target.value;
        setFeedbackText(inputText);
        setCharCount(inputText.length);
    };

    const submitFeedBack = async () => {
        var type = '';
        if(value/25 < 1){
            type = 'Could Improve 👎';
          }
          else if(value/25 <= 2){
            type = 'Good 👍';
          }
          else if(value/25 <= 3){
            type = 'Amazing 🎉';
          }
          else if(value/25 <= 4){
            type = 'Excellent!! 🚀';
          }
        try {
            const token = localStorage.getItem('token');

            if (!isEditReq) {
                const response = await axios.post(`http://localhost:3000/api/v1/user/feedback`, {
                    rating: value,
                    feedback: feedbackText,
                    type: type
                }, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status === 201) {
                    alert('Feedback updated successfully!');
                    setAlreadySubmitted(true);
                }
            }
            else {
                const response = await axios.put(`http://localhost:3000/api/v1/user/feedback`, {
                    rating: value,
                    feedback: feedbackText,
                    type: type
                }, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (response.status === 201) {
                    alert('Feedback updated successfully!');
                    setAlreadySubmitted(true);
                    setIsEditReq(false);
                }
            }
        }
        catch (error) {
            console.error('Error posting feedback:', error.message);
        }
    };

    if (loading) {
        return (
            <div className="h-[100vh] w-full flex flex-col items-center my-[50px]">
                <div className="mt-[-6rem] text-3xl font-bold h-screen flex flex-col items-center justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <div className="h-[100vh] w-full flex flex-col items-center my-[50px]">
            {alreadySubmitted ? (
                <div className="text-3xl mt-[-6rem] font-bold h-screen flex flex-col items-center justify-center">
                    <div className="border-4 border-dashed border-gray-400 p-[2rem] rounded-lg text-center flex flex-col gap-10">
                        <p>Feedback Already Submitted Once</p>
                        <p>Thank You for your feedback 😁</p>
                    </div>
                    <button onClick={() => setAlreadySubmitted(false)} className="text-xl mt-[4rem] font-bold bg-orange-400 py-2 px-3 rounded-lg text-center">Update Review</button>
                </div>
            ) : (
                <div className="flex flex-col p-4 items-center justify-between rounded-lg bg-slate-200 w-[40%] min-h-[400px] border-4 border-dashed border-gray-400">
                    <div className="text-center">
                        <div className="flex flex-col justify-between gap-4">
                            <h1 className="font-bold text-2xl">Feedback Form</h1>
                            <p className="text-md my-[1rem]">Please rate your experience:</p>
                        </div>
                    </div>
                    <div className="text-center w-[80%]">
                        <Slider value={value} setValue={setValue} />
                    </div>
                    <div className="text-center w-[60%] my-2">
                        <textarea
                            value={feedbackText}
                            onChange={handleFeedbackChange}
                            className="mt-4 bg-gray-100 p-2 border rounded w-full resize-none"
                            rows={4}
                            maxLength={maxChars}
                            placeholder="Write your feedback here..."
                        />
                        <p className="my-2 text-sm text-gray-500">{charCount}/{maxChars} characters</p>
                        {
                            charCount === maxChars && (
                                <div className="my-2">
                                    <p className="text-red-500">{displayMessage}</p>
                                </div>
                            )
                        }
                        <button onClick={submitFeedBack} className="mt-3 py-2 px-5 text-lg font-bold bg-orange-400 rounded-lg">Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
}
