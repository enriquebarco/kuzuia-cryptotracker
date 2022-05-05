export const formatData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          backgroundColor: "rgb(255, 99, 132, 0.8)",
          borderColor: "rgba(255, 99, 132, 0.2)",
          fill: false
        }
      ]
    };
  
    let dates = data.map((val) => {
      const timestamp = val[0] ;
      let date = new Date(timestamp * 1000); //convert timestamp from seconds into milliseconds
      let day = date.getDate(); // day as a number between 1 - 31 
      let month = date.getMonth() + 1; // add one because value is zero based
      let year = date.getFullYear();
  
      let final = `${month}-${day}-${year}`;
      return final;
    });
  
    let priceArr = data.map((val) => {
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
  }