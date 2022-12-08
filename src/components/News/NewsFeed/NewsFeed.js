import React, { useEffect, useState } from "react";
import NewsArticle from "../NewsArticle";
import { Loading } from "../../lib";
import "./NewsFeed.css";

const getNewsData = async (topics) => {
  const urlString = topics.map((t) => `"${encodeURIComponent(t)}"`).join(",");
  if (topics.length > 0) {
    const resp = await fetch(`http://localhost:8080/news?topics=${urlString}`);
    const data = await resp.json();
    return data;
  } else {
    return [];
  }
};

const NewsFeed = () => {
  /* TODO: 
    - fetch news from server, break up data and render
    - handle search terms in search bar and append to news
    - look up some kind of dictionary for autocomplete?
    - handle date ranges possibly?
  */
  const [newsData, setNewsData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [topics, setTopics] = useState([]);
  const [latestTopic, setLatestTopic] = useState("");

  useEffect(() => {
    // TODO: pull existing topics from Localstorage
  }, []);

  const onSearchButtonClick = () => {
    const searchTopics = new Set(topics);
    setIsLoadingData(true);
    if (
      latestTopic.length > 0 &&
      !searchTopics.has(latestTopic) &&
      window.confirm(`Do you want to include ${latestTopic} in your search?`)
    ) {
      searchTopics.add(latestTopic);
      setLatestTopic("");
      setTopics(searchTopics);
    }

    getNewsData(Array.from(searchTopics)).then((newsData) => {
      setNewsData(newsData.articles);
      setIsLoadingData(false);
    });
  };

  const onAddTopicClick = (val) => {
    if (val.length > 0) {
      const uniqTopics = new Set(topics);
      uniqTopics.add(val);
      setTopics(Array.from(uniqTopics));
      setLatestTopic("");
    }
  };

  const removeTopic = (topic) => {
    const uniqTopics = new Set(topics);
    uniqTopics.delete(topic);
    setTopics(Array.from(uniqTopics));
  };

  return (
    <div className="container newsFeed">
      <div>News Feed</div>
      <input
        type="string"
        value={latestTopic}
        placeholder="Search for your news topic"
        onChange={(e) => setLatestTopic(e.target.value)}
      />
      <button onClick={(e) => onAddTopicClick(latestTopic)}>
        Add to list of topics
      </button>
      <button onClick={onSearchButtonClick}>Search!</button>

      <div className="topicList">
        {topics.map((topic) => (
          <div className="topic" onClick={() => removeTopic(topic)}>
            {topic}
          </div>
        ))}
      </div>
      {isLoadingData ? (
        <Loading />
      ) : (
        <div className="articles">
          {newsData != null ? (
            <div>
              {newsData.map((news) => (
                <NewsArticle newsData={news} />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
