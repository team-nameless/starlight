import axios from "axios";
import * as d3 from "d3";
import "d3-scale-chromatic";
import { RefObject, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import sparkle from "../assets/images/sparkle.png";
import "../assets/stylesheets/HistoryPage.css";
import "../assets/stylesheets/MainPages.css";
import { apiHost } from "../common/site_setting";
import HeaderBar from "../components/HeaderBar";
import NextPreviousButton from "../components/NextPreviousButton";
import { GameScoreStat, StarlightSong, ThePMGonnaHaveAFunTimeWithMe } from "../index";
import testHeatmapData from "../test_heatmap.json";

// Enhanced cache with expiration time
const heatmapCache = new Map();
const CACHE_EXPIRATION = 30 * 60 * 1000; // 30 minutes

// Pre-computed values for better performance
const D3_CONSTANTS = {
    margin: { top: 0, right: 25, bottom: 50, left: 50 },
    cellSize: 25,
    gap: 2,
    colorDomain: [0, 33, 66, 100],
    colorRange: ["#14432a", "#166b34", "#37a446", "#4dd05a"]
};

function HistoryPage() {
    const { songId, songIndex } = useParams();
    const [currentSong, setCurrentSong] = useState<StarlightSong>();
    const [currentSongIndex, setCurrentSongIndex] = useState(parseInt(songIndex!));
    const [_bestScore, setBestScore] = useState<string | null>(null);
    const [songs, setSongs] = useState<StarlightSong[]>([]);
    const [isSongListOpen, setIsSongListOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const heatmapContainer1Ref = useRef<HTMLDivElement | null>(null);
    const heatmapContainer2Ref = useRef<HTMLDivElement | null>(null);
    const hasRenderedHeatmap1 = useRef<boolean>(false);
    const hasRenderedHeatmap2 = useRef<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Load song data from navigation state if available
    useEffect(() => {
        const { currentSong, currentSongIndex, songs: stateSongs } = location.state || {};
        if (currentSong) {
            setCurrentSong(currentSong);
        }
        if (typeof currentSongIndex === "number") {
            setCurrentSongIndex(currentSongIndex);
        }
        if (stateSongs && stateSongs.length > 0) {
            setSongs(stateSongs);
        }
    }, [location.state]);

    // Fetch song data if not available from navigation state
    useEffect(() => {
        if (currentSong && currentSong.id === Number(songId)) {
            setIsLoading(false);
            return;
        }
        const fetchSongData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiHost}/api/track/${songId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
                setCurrentSong(response.data);
                setCurrentSongIndex(parseInt(songIndex!));
            } catch (error) {
                console.error("Error fetching song data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSongData();
    }, [songId, songIndex, currentSong]);

    useEffect(() => {
        const fetchBestScore = async () => {
            if (currentSong) {
                try {
                    const response = await axios.get(
                        `${apiHost}/api/score/${currentSong.id}/best`,
                        {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            withCredentials: true
                        }
                    );
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

        fetchBestScore().catch((err) => {
            console.error("Error in fetchBestScore:", err);
        });
    }, [currentSong]);

    // Fetch all songs if not available
    useEffect(() => {
        if (songs.length > 0) return;
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
    }, [songs.length]);

    // Optimized heatmap data fetching with better caching
    const fetchHeatmapData = useCallback(
        async (url: string) => {
            try {
                const cacheKey = `${songId}-${url.includes("recent") ? "recent" : "best"}`;
                const now = Date.now();

                if (heatmapCache.has(cacheKey)) {
                    const cached = heatmapCache.get(cacheKey);

                    if (now - cached.timestamp < CACHE_EXPIRATION) {
                        console.log(`Using cached heatmap data for ${cacheKey}`);
                        return cached.data;
                    }
                }
                console.log(`Fetching fresh heatmap data for ${cacheKey}`);
                const response = await axios.get(`${apiHost}${url}`, {
                    withCredentials: true
                });

                const data: GameScoreStat = JSON.parse(response.data["rawJson"]);

                if (data && data.partial && Array.isArray(data.partial)) {
                    const durationInSeconds = Math.floor(data.stats!.duration / 1000);
                    const groupSize = Math.max(1, Math.floor(durationInSeconds / 30));
                    const groups = Array.from({ length: 30 }, (_, i) => (i + 1) * groupSize);

                    const heatmapData = new Array<ThePMGonnaHaveAFunTimeWithMe>(
                        data.partial.length * 5
                    );
                    let dataIndex = 0;

                    data.partial.forEach((segment, index) => {
                        const totalNotes = segment.totalNotes || 1;
                        const judgements = ["M", "B", "G", "P", "CP"];
                        // const properties = ["miss", "bad", "good", "perf", "crit"];
                        const values = [
                            segment.miss,
                            segment.bad,
                            segment.good,
                            segment.perf,
                            segment.crit
                        ];

                        for (let i = 0; i < judgements.length; i++) {
                            const judgement = judgements[i];
                            // const property = properties[i];
                            const count = values[i];
                            const percentage = (count / totalNotes) * 100;

                            heatmapData[dataIndex++] = {
                                group: groups[index],
                                variable: judgement,
                                value: percentage,
                                segment: count,
                                totalNotes
                            };
                        }
                    });

                    const result = {
                        data: heatmapData,
                        score: data.stats!.score,
                        grade: data.stats!.grade,
                        isFallback: false
                    };

                    heatmapCache.set(cacheKey, {
                        data: result,
                        timestamp: now
                    });

                    return result;
                } else {
                    throw new Error("Invalid API response");
                }
            } catch (error) {
                console.error("Error fetching heatmap data:", error);

                // Use fallback data from test file
                const data = testHeatmapData;
                const durationInSeconds = Math.floor(data.stats.duration / 1000);
                const groups = Array.from(
                    { length: 30 },
                    (_, i) => (i + 1) * Math.round(durationInSeconds / 30)
                );
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

                return {
                    data: heatmapData,
                    score: testHeatmapData.stats.score,
                    grade: "A",
                    isFallback: true
                };
            }
        },
        [songId]
    );

    // Optimized renderHeatmap function with requestAnimationFrame
    const renderHeatmap = useCallback(
        async (
            url: string,
            containerRef: RefObject<HTMLDivElement | null>,
            _scoreUrl: string,
            _songId: number
        ) => {
            try {
                const container = containerRef.current;

                if (!container) {
                    console.error(`Container not found.`);
                    setIsLoading(false);
                    return;
                }

                // Show loading state immediately
                container.innerHTML =
                    '<div class="heatmap-loading"><div class="heatmap-spinner"></div><p>Loading heatmap data...</p></div>';

                // Fetch data outside the animation frame
                const { data, score, grade, isFallback } = await fetchHeatmapData(url);

                if (!containerRef.current) {
                    // Component was unmounted during data fetch
                    return;
                }

                // Use requestAnimationFrame for smoother rendering
                requestAnimationFrame(() => {
                    if (!containerRef.current) return;

                    // Clear container content
                    container.innerHTML = "";

                    // Create score element
                    const scoreElement = document.createElement("div");
                    scoreElement.className = "overall-score";
                    const sparkleLeft = document.createElement("img");
                    sparkleLeft.src = sparkle;
                    sparkleLeft.style.width = "32px";
                    sparkleLeft.style.height = "32px";
                    sparkleLeft.style.verticalAlign = "middle";
                    sparkleLeft.style.display = "inline";
                    sparkleLeft.style.marginBottom = "5px";
                    const sparkleRight = sparkleLeft.cloneNode() as HTMLImageElement;
                    scoreElement.appendChild(sparkleLeft);
                    scoreElement.appendChild(document.createTextNode(` ${score} `));
                    scoreElement.appendChild(sparkleRight);
                    container.appendChild(scoreElement);

                    // Create grade element
                    const gradeElement = document.createElement("div");
                    gradeElement.textContent = `- Grade: ${grade} -`;
                    gradeElement.className = "grade";
                    container.appendChild(gradeElement);

                    // Optimize D3 rendering with minimal DOM operations
                    renderOptimizedD3Heatmap(container, data, isFallback);

                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Error rendering heatmap:", error);
                if (containerRef.current) {
                    containerRef.current.innerHTML =
                        '<div class="heatmap-error">Failed to load heatmap data</div>';
                }
                setIsLoading(false);
            }
        },
        [fetchHeatmapData]
    );

    // Extracted D3 rendering to optimize performance
    function renderOptimizedD3Heatmap(
        container: HTMLElement,
        data: ThePMGonnaHaveAFunTimeWithMe[],
        isFallback: boolean
    ) {
        const { margin, cellSize, gap, colorDomain, colorRange } = D3_CONSTANTS;
        const width = 900 - margin.left - margin.right;
        const height = 186 - margin.top - margin.bottom;

        // Create SVG only once (no need to append multiple g elements)
        const svg = d3
            .select(container)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Compute scales once - use useMemo-like approach by extracting groups and variables first
        const myGroups = Array.from(
            new Set(data.map((d: ThePMGonnaHaveAFunTimeWithMe) => d.group))
        );
        const myVars = Array.from(
            new Set(data.map((d: ThePMGonnaHaveAFunTimeWithMe) => d.variable))
        );

        // Use memoized scales
        const x = d3.scaleBand().range([0, width]).domain(myGroups.map(String)).padding(0.05);

        const y = d3
            .scaleBand()
            .range([height, 0])
            .domain(myVars as string[])
            .padding(0.05);

        const myColor = d3.scaleLinear<string>().domain(colorDomain).range(colorRange);

        // Draw axes once
        const bottomAxis = svg
            .append("g")
            .style("font-size", 15)
            .attr("transform", `translate(0,${height})`)
            .call(
                d3
                    .axisBottom(x)
                    .tickSize(0)
                    .tickFormat((d) => {
                        // Show fewer labels for better performance
                        return parseInt(d) % 1 === 0 ? d : "";
                    })
            );

        bottomAxis.select(".domain").remove();

        const leftAxis = svg.append("g").style("font-size", 15).call(d3.axisLeft(y).tickSize(0));

        leftAxis.select(".domain").remove();

        // Single tooltip for all rectangles
        const tooltip = d3
            .select(container)
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Define event handlers outside the data join to avoid recreating functions
        const mouseover = function (this: SVGRectElement) {
            tooltip.style("opacity", 1);
            d3.select(this).style("stroke", "black").style("opacity", 1);
        };

        const mousemove = function (event: MouseEvent, d: ThePMGonnaHaveAFunTimeWithMe) {
            tooltip
                .html(
                    `BeatperTotal: ${d.segment} / ${d.totalNotes}<br>Beat Accuracy: (${Math.floor(d.value) || 0}%)`
                )
                .style("left", `${event.pageX + 20}px`)
                .style("top", `${event.pageY - 20}px`);
        };

        const mouseleave = function (this: SVGRectElement) {
            tooltip.style("opacity", 0);
            d3.select(this).style("stroke", "none").style("opacity", 0.8);
        };

        // Use a single selection for better performance - create a fragment to minimize reflows
        const rectangles = svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: ThePMGonnaHaveAFunTimeWithMe) => (x(String(d.group)) || 0) + gap / 2)
            .attr("y", (d: ThePMGonnaHaveAFunTimeWithMe) => (y(String(d.variable)) || 0) + gap / 2)
            .attr("width", cellSize - gap)
            .attr("height", cellSize - gap)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", (d: ThePMGonnaHaveAFunTimeWithMe) => myColor(d.value || 0))
            .style("stroke-width", 4)
            .style("stroke", "none")
            .style("opacity", 0.8);

        // Add event listeners in batch
        rectangles
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // Add fallback text if needed
        if (isFallback) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom + 20)
                .attr("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", "red")
                .text("Data fetched from test_heatmap.json");
        }
    }

    // Optimize useEffect for rendering heatmaps with better resetting
    useEffect(() => {
        // Reset rendering flags when song changes
        if (currentSong?.id !== Number(songId)) {
            hasRenderedHeatmap1.current = false;
            hasRenderedHeatmap2.current = false;
        }
        // Only render if we haven't already rendered for this song
        if (!hasRenderedHeatmap1.current && currentSong) {
            hasRenderedHeatmap1.current = true;
            setIsLoading(true);
            // Delay the second heatmap to prevent concurrent rendering
            renderHeatmap(
                `/api/score/${currentSong.id}/recent`,
                heatmapContainer1Ref,
                `/api/score/${currentSong.id}/recent`,
                currentSong.id
            );
        }
    }, [currentSong, renderHeatmap, songId]);

    useEffect(() => {
        // Only render if first heatmap is complete and second hasn't been rendered
        if (hasRenderedHeatmap1.current && !hasRenderedHeatmap2.current && currentSong) {
            hasRenderedHeatmap2.current = true;
            // Small delay to not compete with first heatmap rendering
            setTimeout(() => {
                renderHeatmap(
                    `/api/score/${currentSong.id}/best`,
                    heatmapContainer2Ref,
                    `/api/score/${currentSong.id}/best`,
                    currentSong.id
                );
            }, 100);
        }
    }, [currentSong, renderHeatmap, hasRenderedHeatmap1.current]);

    const handleSongClick = (song: StarlightSong) => () => {
        const index = songs.findIndex((s) => s.id === song.id);
        if (index !== -1) {
            setIsLoading(true);
            hasRenderedHeatmap1.current = false;
            hasRenderedHeatmap2.current = false;

            const imgElement = document.querySelector(".background-image img") as HTMLImageElement;
            if (imgElement && song.backgroundUrl) {
                imgElement.classList.add("fade-out");

                const onTransitionEnd = () => {
                    setCurrentSongIndex(index);
                    setCurrentSong(song);

                    imgElement.src = song.backgroundUrl || "";
                    imgElement.classList.remove("fade-out");

                    navigate(`/HistoryPage/${song.id}/${index}`, {
                        state: {
                            currentSong: song,
                            currentSongIndex: index,
                            songs: songs
                        },
                        replace: true
                    });
                };

                imgElement.addEventListener("transitionend", onTransitionEnd, {
                    once: true
                });

                // Fallback in case transition event doesn't fire
                setTimeout(() => {
                    if (imgElement.classList.contains("fade-out")) {
                        onTransitionEnd();
                    }
                }, 500);
            } else {
                // If image element not found, still update the song
                setCurrentSongIndex(index);
                setCurrentSong(song);
                // Update navigation with songs
                navigate(`/HistoryPage/${song.id}/${index}`, {
                    state: {
                        currentSong: song,
                        currentSongIndex: index,
                        songs: songs
                    },
                    replace: true
                });
            }
        }
    };

    const toggleSongList = () => {
        setIsSongListOpen(!isSongListOpen);
    };

    return (
        <>
            {currentSong && (
                <HeaderBar
                    currentSong={currentSong as StarlightSong}
                    currentSongIndex={currentSongIndex}
                    setCurrentSong={setCurrentSong}
                    setCurrentSongIndex={setCurrentSongIndex}
                    songs={songs}
                    handleSongClick={handleSongClick}
                    toggleSongList={toggleSongList}
                    isSongListOpen={isSongListOpen}
                />
            )}

            {isLoading && (
                <div className="loader">
                    <div className="one"></div>
                    <div className="two"></div>
                </div>
            )}

            <div className="historypage">
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="content-layer">
                        <div className="background-image">
                            <img
                                src={
                                    currentSong && currentSong.backgroundUrl
                                        ? `${currentSong.backgroundUrl}`
                                        : ""
                                }
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
                        <div
                            id="heatmap-container-1"
                            className="heatmap-container"
                            ref={heatmapContainer1Ref}
                        ></div>
                        <h3 className="heatmap-title best-score-title">Best Score</h3>
                        <div
                            id="heatmap-container-2"
                            className="heatmap-container"
                            ref={heatmapContainer2Ref}
                        ></div>
                    </div>
                </Suspense>
            </div>
        </>
    );
}

export default HistoryPage;
