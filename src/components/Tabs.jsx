import { useCallback, useEffect, useState } from "react";
import Input from "./Input";
import { v4 as uuidv4 } from "uuid";
import "./Tabs.css";

const storage = "tab-storage";
const activeTabInfo = "active-tab";

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
                    console.log("got-data");
                }
            } catch (error) {
                const newTab = makeNewTab("new-tab");
                setTabsData([newTab]);
                setActiveTabId(newTab.id);
                console.log("error-in-data");
            }
        } else {
            const newTab = makeNewTab("new-tab");
            setTabsData([newTab]);
            setActiveTabId(newTab.id);
            console.log("new-tab");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(storage, JSON.stringify(tabsData));
        localStorage.setItem(activeTabInfo, activeTabId);
    }, [tabsData]);

    const addTab = () => {
        const newTab = makeNewTab(`Untitled-${tabsData.length}`);
        setTabsData((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
        console.log("new-tab-added");
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

    const setNewTabData = (id, newData) => {
        setTabsData((prev) =>
            prev.map((tab) =>
                tab.id === id
                    ? { ...tab, data: { ...tab.data, ...newData } }
                    : tab
            )
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
        [tabsData]
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
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            style={
                                activeTabId === tab.id
                                    ? {
                                          backgroundColor:
                                              "rgba(185, 185, 185, 1)",
                                      }
                                    : null
                            }
                        >
                            {/* {tab.name.slice(0, 10)} */}
                            <input
                                style={
                                    activeTabId === tab.id
                                        ? {
                                              backgroundColor:
                                                  "rgba(185, 185, 185, 1)",
                                          }
                                        : null
                                }
                                type="text"
                                value={tab.name}
                                onChange={(e) =>
                                    renameTab(tab.id, e.target.value)
                                }
                                className="tab-name"
                            />
                        </button>
                        <span
                            onClick={() => closeTab(tab.id)}
                            className="close"
                        >
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
                            {/* <input
                                type="text"
                                value={tab.name}
                                onChange={(e) =>
                                    renameTab(tab.id, e.target.value)
                                }
                                className="tab-name"
                            /> */}
                            <Input
                                tabId={activeTabId}
                                data={tab.data}
                                onChangeData={(newData) =>
                                    setTabData(tab.id, newData)
                                }
                            />
                        </div>
                    )
            )}
        </div>
    );
}
