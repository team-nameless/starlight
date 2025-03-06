import axios from "axios";
import * as d3 from "d3";
import "d3-scale-chromatic";
import * as assert from "node:assert";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import sparkle from "../assets/images/sparkle.png";
import "../assets/stylesheets/HeatmapStyle.css";
import "../assets/stylesheets/MainPages.css";
import { apiHost } from "../common/site_setting.ts";
import HeaderBar from "../components/HeaderBar.tsx";
import NextPreviousButton from "../components/NextPreviousButton.tsx";
import { StarlightSong } from "../index";
import testHeatmapData from "../test_heatmap.json";

function HistoryPage() {
    const { songId, songIndex } = useParams();

    assert(songId !== undefined);
    assert(songIndex !== undefined);

    const [currentSong, setCurrentSong] = useState<StarlightSong>();
    const [currentSongIndex, setCurrentSongIndex] = useState(parseInt(songIndex));
    const [_bestScore, setBestScore] = useState<string | null>(null);
    const [songs, setSongs] = useState([]);
    const heatmapContainer1Ref = useRef(null);
    const heatmapContainer2Ref = useRef(null);
    const hasRenderedHeatmap1 = useRef(false);
    const hasRenderedHeatmap2 = useRef(false);
    const location = useLocation();

    useEffect(() => {
        const { currentSong, currentSongIndex } = location.state || {};
        setCurrentSong(currentSong);
        setCurrentSongIndex(currentSongIndex);
    }, [location.state]);

    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const response = await axios.get(`${apiHost}/api/track/${songId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                setCurrentSong(response.data);
                setCurrentSongIndex(parseInt(songIndex));
            } catch (error) {
                console.error("Error fetching song data:", error);
            }
        };

        fetchSongData().catch();
    }, [songId, songIndex]);

    useEffect(() => {
        const fetchBestScore = async () => {
            if (currentSong) {
                try {
                    const response = await axios.get(`${apiHost}/api/score/${currentSong.id}/best`, {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        withCredentials: true
                    });
                    if (response.status === 200) {
                        setBestScore(response.data.totalPoints);
                    } else if (response.status === 204) {
                        setBestScore("No record");
                    } else {
                        console.error("Error fetching best score:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching best score:", error);
                    setBestScore("No record");
                }
            }
        };

        fetchBestScore().catch(err => {
            throw err;
        });
    }, [currentSong]);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const songsResponse = await axios.get(`${apiHost}/api/track/all`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                const fetchedSongs = songsResponse.data;
                setSongs(fetchedSongs);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        };

        fetchSongs();
    }, []);

    const fetchHeatmapData = async (url: any) => {
        try {
            const response = await axios.get(`${apiHost}${url}`, {
                withCredentials: true
            });

            const data = JSON.parse(response.data["rawJson"]);

            if (data && data.partial && Array.isArray(data.partial)) {
                const durationInSeconds = Math.floor(data.stats.duration / 1000);
                const groups = Array.from({ length: 30 }, (_, i) => (i + 1) * Math.floor(durationInSeconds / 30));
                const heatmapData: { group: number; variable: string; value: number; segment: any; totalNotes: any }[] =
                    [];

                data.partial.forEach(
                    (
                        segment: { totalNotes: any; miss: number; bad: number; good: number; crit: number },
                        index: number
                    ) => {
                        const totalNotes = segment.totalNotes;
                        heatmapData.push({
                            group: groups[index],
                            variable: "M",
                            value: (segment.miss / totalNotes) * 100,
                            segment: segment.miss,
                            totalNotes: totalNotes
                        });
                        heatmapData.push({
                            group: groups[index],
                            variable: "B",
                            value: (segment.bad / totalNotes) * 100,
                            segment: segment.bad,
                            totalNotes: totalNotes
                        });
                        heatmapData.push({
                            group: groups[index],
                            variable: "G",
                            value: (segment.good / totalNotes) * 100,
                            segment: segment.good,
                            totalNotes: totalNotes
                        });
                        heatmapData.push({
                            group: groups[index],
                            variable: "P",
                            value: (segment.bad / totalNotes) * 100,
                            segment: segment.bad,
                            totalNotes: totalNotes
                        });
                        heatmapData.push({
                            group: groups[index],
                            variable: "CP",
                            value: (segment.crit / totalNotes) * 100,
                            segment: segment.crit,
                            totalNotes: totalNotes
                        });
                    }
                );

                return { data: heatmapData, score: data.stats.score, isFallback: false };
            } else {
                throw new Error("Invalid API response");
            }
        } catch (error) {
            console.error("Error fetching heatmap data:", error);

            const data = testHeatmapData;
            const durationInSeconds = Math.floor(data.stats.duration / 1000);
            const groups = Array.from({ length: 30 }, (_, i) => (i + 1) * Math.round(durationInSeconds / 30));
            const heatmapData: {
                group: number;
                variable: string;
                value: number;
                segment: number;
                totalNotes: number;
            }[] = [];

            data.partial.forEach((segment, index) => {
                const totalNotes = segment.totalNotes;
                heatmapData.push({
                    group: groups[index],
                    variable: "M",
                    value: (segment.miss / totalNotes) * 100,
                    segment: segment.miss,
                    totalNotes: totalNotes
                });
                heatmapData.push({
                    group: groups[index],
                    variable: "B",
                    value: (segment.bad / totalNotes) * 100,
                    segment: segment.bad,
                    totalNotes: totalNotes
                });
                heatmapData.push({
                    group: groups[index],
                    variable: "G",
                    value: (segment.good / totalNotes) * 100,
                    segment: segment.good,
                    totalNotes: totalNotes
                });
                heatmapData.push({
                    group: groups[index],
                    variable: "P",
                    value: (segment.bad / totalNotes) * 100,
                    segment: segment.bad,
                    totalNotes: totalNotes
                });
                heatmapData.push({
                    group: groups[index],
                    variable: "CP",
                    value: (segment.crit / totalNotes) * 100,
                    segment: segment.crit,
                    totalNotes: totalNotes
                });
            });

            return { data: heatmapData, score: data.stats.score, isFallback: true };
        }
    };

    const fetchOverallScore = async (url: any) => {
        try {
            const response = await axios.get(`${apiHost}${url}`, {
                withCredentials: true
            });
            const data = JSON.parse(response.data["rawJson"]);
            return data.stats.score || 100000;
        } catch (error) {
            console.error("Error fetching overall score:", error);
            return testHeatmapData.stats.score;
        }
    };

    const fetchGrade = async (url: any) => {
        try {
            const response = await axios.get(`${apiHost}${url}`, {
                withCredentials: true
            });
            const data = JSON.parse(response.data["rawJson"]);
            return data.stats.grade || "A";
        } catch (error) {
            console.error("Error fetching grade:", error);
            return testHeatmapData.stats.grade;
        }
    };

    const renderHeatmap = useCallback(async (url: any, containerRef: { current: any }, scoreUrl: any, _songId: any) => {
        const container = containerRef.current;
        if (!container) {
            console.error(`Container not found.`);
            return;
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const overallScore = await fetchOverallScore(scoreUrl);
        const grade = await fetchGrade(scoreUrl);

        const scoreElement = document.createElement("div");
        scoreElement.className = "overall-score";
        const sparkleLeft = document.createElement("img");
        sparkleLeft.src = sparkle;
        sparkleLeft.style.width = "32px";
        sparkleLeft.style.height = "32px";
        sparkleLeft.style.verticalAlign = "middle";
        sparkleLeft.style.display = "inline";
        sparkleLeft.style.marginBottom = "5px";
        const sparkleRight = sparkleLeft.cloneNode();
        scoreElement.appendChild(sparkleLeft);
        scoreElement.appendChild(document.createTextNode(` ${overallScore} `));
        scoreElement.appendChild(sparkleRight);
        container.appendChild(scoreElement);

        const gradeElement = document.createElement("div");
        gradeElement.textContent = `- Grade: ${grade} -`;
        gradeElement.className = "grade";
        container.appendChild(gradeElement);

        const { data, isFallback } = await fetchHeatmapData(url);

        const margin = { top: 0, right: 25, bottom: 50, left: 50 };
        const width = 900 - margin.left - margin.right;
        const height = 186 - margin.top - margin.bottom;

        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const myGroups = Array.from(new Set(data.map(d => d.group)));
        const myVars = Array.from(new Set(data.map(d => d.variable)));

        const cellSize = 25;
        const gap = 2;
        const x = d3.scaleBand().range([0, width]).domain(myGroups.map(String)).padding(0.05);
        const y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);

        // Fix for the type error with d3.scaleLinear().range()
        const myColor = d3
            .scaleLinear<string>()
            .domain([0, 33, 66, 100])
            .range(["#14432a", "#166b34", "#37a446", "#4dd05a"]);

        svg.append("g")
            .style("font-size", 15)
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .select(".domain")
            .remove();

        svg.append("g").style("font-size", 15).call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

        const tooltip = d3.select(container).append("div").style("opacity", 0).attr("class", "tooltip");

        const mouseover = function (this: any, _d: any) {
            tooltip.style("opacity", 1);
            d3.select(this).style("stroke", "black").style("opacity", 1);
        };

        const mousemove = function (
            event: { pageX: number; pageY: number },
            d: { segment: any; totalNotes: any; value: number }
        ) {
            tooltip
                .html(`BeatperTotal: ${d.segment} / ${d.totalNotes}<br>Beat Accuracy: (${Math.floor(d.value) || 0}%)`)
                .style("left", `${event.pageX + 20}px`)
                .style("top", `${event.pageY - 20}px`);
        };

        const mouseleave = function (this: any) {
            tooltip.style("opacity", 0);
            d3.select(this).style("stroke", "none").style("opacity", 0.8);
        };

        svg.selectAll()
            .data(data, (d: any) => `${d.group}:${d.variable}`)
            .enter()
            .append("rect")
            .attr("x", d => (x(String(d.group)) ?? 0) + gap / 2)
            .attr("y", d => (y(d.variable) ?? 0) + gap / 2)
            .attr("width", cellSize - gap)
            .attr("height", cellSize - gap)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", d => myColor(d.value || 0))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        if (isFallback) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", "red")
                .text("Data fetched from test_heatmap.json");
        }
    }, []);

    useEffect(() => {
        if (hasRenderedHeatmap1.current)
            return () => {
                console.warn("Rendered Heatmap1 complete!");
            };

        const renderHeatmap1 = async () => {
            if (currentSong && !hasRenderedHeatmap1.current) {
                hasRenderedHeatmap1.current = true;
                await renderHeatmap(
                    `/api/score/${currentSong.id}/recent`,
                    heatmapContainer1Ref,
                    `/api/score/${currentSong.id}/recent`,
                    currentSong.id
                );
            }
        };
        renderHeatmap1();

        return () => {
            console.warn("Heatmap 1 triggered re-render!");
        };
    }, [renderHeatmap, currentSong, songId]);

    useEffect(() => {
        if (hasRenderedHeatmap2.current)
            return () => {
                console.warn("Rendered Heatmap2 complete!");
            };

        const renderHeatmap2 = async () => {
            if (currentSong) {
                hasRenderedHeatmap2.current = true;
                await renderHeatmap(
                    `/api/score/${currentSong.id}/best`,
                    heatmapContainer2Ref,
                    `/api/score/${currentSong.id}/best`,
                    currentSong.id
                );
            }
        };
        renderHeatmap2();

        return () => {
            console.warn("Heatmap 2 triggered re-render!");
        };
    }, [renderHeatmap, currentSong, songId]);

    return (
        <div className="historypage">
            <HeaderBar
                currentSong={currentSong as StarlightSong}
                currentSongIndex={currentSongIndex}
                setCurrentSong={setCurrentSong}
                setCurrentSongIndex={setCurrentSongIndex}
                songs={songs}
            />
            <Suspense fallback={<div>Loading...</div>}>
                <div className="content-layer">
                    <div className="background-image">
                        <img
                            src={currentSong && currentSong.backgroundUrl ? `${currentSong.backgroundUrl}` : ""}
                            alt="Background"
                        />
                    </div>

                    <div className="song-info-history">
                        <div className="song-name-history">{currentSong?.title}</div>
                        <div className="artist-name-history">- {currentSong?.artist} -</div>
                    </div>

                    <NextPreviousButton
                        currentSongIndex={currentSongIndex}
                        setCurrentSongIndex={setCurrentSongIndex}
                        songs={songs}
                        setCurrentSong={setCurrentSong}
                    />

                    <h3 className="heatmap-title latest-score-title">Latest Score</h3>
                    <div id="heatmap-container-1" className="heatmap-container" ref={heatmapContainer1Ref}></div>
                    <h3 className="heatmap-title best-score-title">Best Score</h3>
                    <div id="heatmap-container-2" className="heatmap-container" ref={heatmapContainer2Ref}></div>
                </div>
            </Suspense>
        </div>
    );
}

export default HistoryPage;
