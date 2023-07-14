import React, { useEffect, useState } from "react";
import { Ring } from "@uiball/loaders";
import "./userProfile.css";

export const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExtensionMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === "EXTENSION_CLICKED") {
      const linkedInURLPattern =
        /https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]*/;
      const profileUrl = event.data.profileUrl;

      if (linkedInURLPattern.test(profileUrl)) {
        setIsLoading(true);
        setUserData([]);
        setError("");
        fetch(`http://192.168.2.61:5200/linkedin-profile?url=${profileUrl}`)
          .then((response) => response.json())
          .then((result) => {
            console.log(result)
            setUserData(result.result);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("API call failed:", error);
            setIsLoading(false);
            setError("Please try again.");
          });
      } else {
        setError("Please enter a valid LinkedIn profile !");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);

    return () => {
      window.removeEventListener("message", handleExtensionMessage);
    };
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Copied to clipboard:", text);
      })
      .catch((error) => {
        console.error("Failed to copy to Clipboard:", error);
      });
  };

  const renderMessages = () => {
    if (isLoading) {
      return (
        <div className="loading-spinner">
          <Ring size={55} lineWeight={3} speed={3} color="black" />
        </div>
      );
    } else if (userData.length > 0) {
      return userData.map((message, index) => (
        <div key={index}>
          {message.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              <p>{line}</p>
              {index === message.split("\n").length - 1 && (
                <button
                  onClick={() => copyToClipboard(message)}
                  className="button"
                >
                  Copy
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      ));
    } else if (error) {
      return <p className="error-message">{error}</p>;
    }
  };

  return <div className="container">{renderMessages()}</div>;
};
