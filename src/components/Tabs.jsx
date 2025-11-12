import { useCallback, useEffect, useState } from "react";
import Input from "./Input";
import "./Tabs.css";

const storage = "tab-storage";
const activeTabInfo = "active-tab";

const uuidv4 = () =>
  crypto?.randomUUID?.() ??
  Date.now().toString(36) + Math.random().toString(36).slice(2);

function makeNewTab(name = `Untitled`) {
  return {
    id: uuidv4(),
    name,
    data: {
      method: "GET",
      url: "https://icanhazdadjoke.com/slack",
      params: {},
      body: "",
      contentType: "None",
      response: null,
    },
  };
}

export default function Tabs() {
  const [tabsData, setTabsData] = useState([]);
  const [activeTabId, setActiveTabId] = useState("");

  useEffect(() => {
    const data = localStorage.getItem(storage);
    const activeInfo = localStorage.getItem(activeTabInfo);

    if (data && data.length !== 0) {
      try {
        const parsedData = JSON.parse(data);
        if (Array.isArray(parsedData) && parsedData.length) {
          setTabsData(parsedData);
          setActiveTabId(activeInfo);
        }
      } catch {
        const newTab = makeNewTab("new-tab");
        setTabsData([newTab]);
        setActiveTabId(newTab.id);
      }
    } else {
      const newTab = makeNewTab("new-tab");
      setTabsData([newTab]);
      setActiveTabId(newTab.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storage, JSON.stringify(tabsData));
    localStorage.setItem(activeTabInfo, activeTabId);
  }, [tabsData, activeTabId]);

  const addTab = () => {
    const newTab = makeNewTab(`Untitled-${tabsData.length}`);
    setTabsData((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id) => {
    setTabsData((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      if (filtered.length === 0) {
        const t = [makeNewTab("Untitled-0")];
        setActiveTabId(t[0].id);
        return t;
      }
      if (id === activeTabId) setActiveTabId(filtered[0].id);
      return filtered;
    });
  };

  const renameTab = (id, newName) => {
    setTabsData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: newName } : t))
    );
  };

  const setTabData = useCallback(
    (id, newData) => {
      setTabsData((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, data: { ...t.data, ...newData } } : t
        )
      );
    },
    []
  );

  return (
    <div id="tabs-container">
      <div id="tabs">
        {tabsData.map((tab) => (
          <div
            className="tab-btn"
            style={
              activeTabId === tab.id
                ? { backgroundColor: "rgba(185, 185, 185, 1)" }
                : null
            }
            key={tab.id}
          >
            <button
              onClick={() => setActiveTabId(tab.id)}
              style={
                activeTabId === tab.id
                  ? { backgroundColor: "rgba(185, 185, 185, 1)" }
                  : null
              }
            >
              <input
                style={
                  activeTabId === tab.id
                    ? { backgroundColor: "rgba(185, 185, 185, 1)" }
                    : null
                }
                type="text"
                value={tab.name}
                onChange={(e) => renameTab(tab.id, e.target.value)}
                className="tab-name"
              />
            </button>
            <span onClick={() => closeTab(tab.id)} className="close">
              <i className="fa-solid fa-xmark"></i>
            </span>
          </div>
        ))}
        <span onClick={addTab} id="add-tab">
          <i className="fa-solid fa-plus"></i>
        </span>
      </div>
      {tabsData.map(
        (tab) =>
          tab.id === activeTabId && (
            <div key={tab.id}>
              <Input
                tabId={activeTabId}
                data={tab.data}
                onChangeData={(newData) => setTabData(tab.id, newData)}
              />
            </div>
          )
      )}
    </div>
  );
}
