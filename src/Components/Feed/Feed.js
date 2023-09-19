import React, {
  useState,
  useEffect,
  useRef,
  useTransition,
  useCallback,
} from "react";
import ReactPlayer from "react-player";
import "./Feed.css";
import faultradio from "../Home/SecondSection/Logos/radio-stations/fault-radio.png";
import kioskradio from "../Home/SecondSection/Logos/radio-stations/kiosk-radio.png";
import nts from "../Home/SecondSection/Logos/radio-stations/nts.png";
import thelotradio from "../Home/SecondSection/Logos/radio-stations/the-lot-radio.png";
import trnstnradio from "../Home/SecondSection/Logos/radio-stations/trnstn-radio.png";

const getLogoByUser = (user) => {
  switch (user) {
    case "faultradio":
      return faultradio;
    case "kioskradio":
      return kioskradio;
    case "nts-latest":
      return nts;
    case "thelotradio":
      return thelotradio;
    case "trnstnradio":
      return trnstnradio;
    default:
      return null;
  }
};

const Feed = () => {
  const [usersData, setUsersData] = useState([]);
  const [currentRadioStation, setCurrentRadioStation] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const elementsRef = useRef([]);
  const limit = 5;
  const lastTrackRef = useRef();
  const debounceTimeout = useRef(null);
  const [isPending, startTransition] = useTransition({
    timeoutMs: 3000,
  });

  const fetchTracks = useCallback(() => {
    if (isLoading) {
      return;
    }

    // Clear any existing timeouts
    if (debounceTimeout.currentRadioStation) {
      clearTimeout(debounceTimeout.currentRadioStation);
    }

    // Add a new timeout
    debounceTimeout.currentRadioStation = setTimeout(() => {
      startTransition(() => {
        setIsLoading(true);

        fetch(
          `https://sinecloud-server.onrender.com/api/soundcloud?offset=${offset}&limit=${limit}`
        )
          .then((response) => {
            if (!response.ok)
              throw new Error(`Request failed with status ${response.status}`);
            return response.json();
          })
          .then((data) => {
            setUsersData((oldData) => [...oldData, ...data.message]);
            setOffset((oldOffset) => oldOffset + limit);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setIsLoading(false);
          });
      });
    }, 300);
  }, [isLoading, offset, limit]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentRadioStation(entry.target.dataset.user);
          }
        });
      },
      { threshold: 0.5 }
    );

    elementsRef.currentRadioStation.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      elementsRef.currentRadioStation.forEach((element) => {
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [usersData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            fetchTracks(); // Fetch more tracks when last track is in view
          }
        });
      },
      { threshold: 0.2 }
    );

    if (lastTrackRef.currentRadioStation) {
      observer.observe(lastTrackRef.currentRadioStation);
    }

    return () => {
      if (lastTrackRef.currentRadioStation) {
        observer.unobserve(lastTrackRef.currentRadioStation);
      }
    };
  }, [usersData, isLoading]);

  return (
    <div className="feed">
      <h1>
        Feed me <br className="break-title" />
        new music
      </h1>
      <div className="rotate-div"></div>
      <div className="img-container">
        {usersData.length > 0 && (
          <img
            src={getLogoByUser(currentRadioStation)}
            className="radio-station-img"
            alt={currentRadioStation}
          />
        )}
      </div>

      {usersData.map((data, index) => {
        console.log(data, index);
        const isLastItem = index === usersData.length - 1;
        return (
          <div
            className="feed-player-container"
            data-user={data.user}
            ref={(element) => {
              elementsRef.currentRadioStation.push(element);
              if (isLastItem) lastTrackRef.currentRadioStation = element;
            }}
            key={index}
          >
            <ReactPlayer url={data.track.url} className="react-player" />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
