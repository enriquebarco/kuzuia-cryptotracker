export const formatData = (timeFrame, data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          backgroundColor: "rgb(255, 215, 0)",
          borderColor: "rgb(255, 215, 0)",
          fill: false,
        }
      ]
    };

    let newData;
    switch (timeFrame) {
      case "sixMonths": newData = data.slice(0, 117);
        break;
      case "threeMonths": newData = data.slice(0, 59);
        break;
      case "oneWeek": newData = data.slice(0, 7);
        break;
      default:
    }

    
    let dates = newData.map((val) => {
      
      
      const timestamp = val[0] ;
      let date = new Date(timestamp * 1000); //convert timestamp from seconds into milliseconds
      let day = date.getDate(); // day as a number between 1 - 31 
      let month = date.getMonth() + 1; // add one because value is zero based
      let year = parseFloat(date.getFullYear().toString().slice(2)); 
  
      let final = `${month}-${day}-${year}`;
      return final;
    });
  
    let priceArr = newData.map((val) => {
      return val[4];
    });
  
    priceArr.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;

    return finalData;
  };

  export const addCommas = (string) => {
    if(string[1] === ".") return string;
    return string.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  };