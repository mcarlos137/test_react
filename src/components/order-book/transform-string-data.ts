const transformStringData = (data: string[][], priceDecimals: number, amountDecimals: number) => {
    const transformedData: number[][] = []
    for (let d of data) {
        transformedData.push([Number(Number(d[0]).toFixed(priceDecimals)), Number(Number(d[1]).toFixed(amountDecimals))])
    }
    return transformedData
}

export default transformStringData;
