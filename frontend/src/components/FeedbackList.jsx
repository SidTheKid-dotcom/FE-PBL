import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../assets/animations/LoadingSpinner";

export default function FeedbackList() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/admin/feedbacks');
                console.log(response.data.feedbacks)
                setFeedbacks(response.data.feedbacks);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching feedbacks:', error.message);
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-screen-lg mx-auto my-8">
            <h1 className="text-3xl font-bold mb-4 text-center">All Feedbacks</h1>
            <div className="w-full bg-white shadow-md rounded-lg overflow-hidden break-words">
                {feedbacks.length === 0 ? (
                    <p className="text-lg text-center p-4">No feedbacks available.</p>
                ) : (
                    feedbacks.map((feedback) => (
                        <div key={feedback._id} className="border-b border-gray-200 py-4 px-6">
                            <p className="mb-2 text-lg font-semibold">Rating: {feedback.rating}</p>
                            <p className="text-sm text-gray-600 mb-2">Feedback: {feedback.feedback}</p>
                            <p className="mt-2 text-xs text-gray-400">Submitted By: {feedback.userID.data.name}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
