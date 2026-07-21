import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function CatchAll() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to home page for any unmatched routes
        navigate("/", { replace: true });
    }, [navigate]);

    return null;
}
