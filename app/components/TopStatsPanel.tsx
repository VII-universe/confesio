import React from 'react'
import TopStat from './TopStat'

const TopStatsPanel = () => {
    return (
        <div className="w-full gap-16 lg:gap-24 grid grid-cols-2 lg:flex">
            <TopStat
                title="Attention on brand"
                originalPercentage={10}
                newPercentage={20}
                iconType={"lightbulb"}
            />
            <TopStat
                title="Focus"
                originalPercentage={30}
                newPercentage={40}
                iconType={"eye"}
            />
            <TopStat
                title="Memory"
                originalPercentage={50}
                newPercentage={-60}
                iconType={"brain"}
            />
            <TopStat
                title="Cognitive demand"
                originalPercentage={70}
                newPercentage={80}
                iconType={"head"}
            />
        </div>
    )
}

export default TopStatsPanel