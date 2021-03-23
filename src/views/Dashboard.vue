<template>
  <div class="dashboard__main-container">
    <div class="dashboard__info-box-container">
      <InfoBox 
          title="Clients"
          subTitle="Lorem ipsum dolor sit amet"
          :count="200">
          <template #content>
            <div class="progress__container">
              <CustomProgessBar 
                :progressValue="60" 
                :progressMax="200"
                :progressHeight="8"
                variant="sucess" 
                progressLabel="Type 1"
                class="mt-1" />
              <CustomProgessBar 
                :progressValue="23" 
                :progressMax="200"
                :progressHeight="8"
                variant="sucess" 
                progressLabel="Type 2"
                class="mt-1" />
              <CustomProgessBar 
                :progressValue="70" 
                :progressMax="200"
                :progressHeight="8"
                variant="sucess" 
                progressLabel="Type 3"
                class="mt-1" />
            </div>
          </template>
      </InfoBox>
        
      <InfoBox 
        title="Contracts"
        subTitle="Lorem ipsum dolor sit amet"
        :count="200">
        <template #content>
          <div class="progress__container">
            <CustomProgessBar 
              :progressValue="60" 
              :progressMax="200"
              :progressHeight="8"
              progressVariant="danger" 
              progressLabel="Pending"
              class="mt-1" />
            <CustomProgessBar 
              :progressValue="140" 
              :progressMax="200"
              :progressHeight="8"
              progressVariant="success" 
              progressLabel="Approved"
              class="mt-1" />
          </div>
        </template>
      </InfoBox>

      <InfoBox 
        title="Disbursements"
        subTitle="Lorem ipsum dolor sit amet"
        :count="70">
        <template #content>
          <div class="progress__container">
            <CustomProgessBar 
              :progressValue="16" 
              :progressMax="70"
              :progressHeight="8"
              progressVariant="danger" 
              progressLabel="Pending"
              class="mt-1" />
            <CustomProgessBar 
              :progressValue="54" 
              :progressMax="70"
              :progressHeight="8"
              progressVariant="success" 
              progressLabel="Approved"
              class="mt-1" />
          </div>
        </template>
      </InfoBox>
    </div>
    
    <div class="dashboard__content-cotainer">
      <div class="dashboard__left-content"> 
        <!-- <CustomCard
          class="dashboard__chart"
          header="Yearly Sales Comparison"
          subHeader="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque provident totam voluptates. Voluptates, nulla nobis.">
          <template #body>
            
          </template>
        </CustomCard> -->

        <div class="yearly__chart"> 
          <div class="yearly__header"> 
            <div class="yearly__title">YEARLY COLLECTION COMPARISON</div>
            <div class="yearly__sub-title">Lorem ipsum dolor sit amet consectetur adipisicing.</div>
          </div>
          <div class="yearly__content">
            <ApexChart
              :series="areaChart.series" 
              :options="areaChart.options"
              class="dashboard__chart"
              id="test"
              key="test">
            </ApexChart>
          </div>
        </div>

        <div class="other__chart-container">
          <div class="other__chart mr-1"> 
            <div class="other__header"> 
              <div class="other__title">COLLECTION BREAKDOWN</div>
              <div class="other__sub-title">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
            </div>
            <div class="other__content">
              <ApexChart
                :series="donutChart.series" 
                :options="donutChart.options"
                class="donut__chart">
              </ApexChart>
            </div>
          </div>
          <div class="other__chart ml-1"> 
            <div class="other__header"> 
              <div class="other__title">COLLECTION BREAKDOWN</div>
              <div class="other__sub-title">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
            </div>
            <div class="other__content">
              <ApexChart
                :series="donutChart.series" 
                :options="donutChart.options"
                class="donut__chart">
              </ApexChart>
            </div>
          </div>
        </div>
        
      </div>
      <div class="dashboard__right-content">
        <div class="activity__feed">
          <div class="activity__feed-header">
            <v-icon name="rss-square" class="activity__feed-icon"/> <span class="activity__feed-title">  ACTIVITY FEED</span>
          </div>
          <div class="activity__feed-content">
            <Feed v-for="feed in feeds" :key="feed.id" :feed="feed"></Feed>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { CustomCard } from "./components";
import Feed from "./components/Feed";
import InfoBox from "./components/InfoBox"
import CustomProgessBar from "./components/CustomProgressBar"
import Full from "./components/Full"

export default {
  name: 'Dashboard',
  components: {
    CustomCard,
    InfoBox,
    CustomProgessBar,
    Full,
    Feed
  },
  data () {
    return {
      selected: 'Month',
      feeds: [
        {
          id: 1,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 1,
            name: 'jason ponga'
          },
          txnDate: new Date()
        },
        {
          id: 2,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 2,
            name: 'darren ponga'
          },
          txnDate: new Date()
        },
        {
          id: 3,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 1,
            name: 'jason ponga'
          },
          txnDate: new Date()
        },
        {
          id: 4,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 3,
            name: 'ash ponga'
          },
          txnDate: new Date()
        },
        {
          id: 5,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 3,
            name: 'ash ponga'
          },
          txnDate: new Date()
        },
        {
          id: 6,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 1,
            name: 'jason ponga'
          },
          txnDate: new Date()
        },
        {
          id: 7,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 2,
            name: 'darren ponga'
          },
          txnDate: new Date()
        },
        {
          id: 8,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 1,
            name: 'jason ponga'
          },
          txnDate: new Date()
        },
        {
          id: 9,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 3,
            name: 'ash ponga'
          },
          txnDate: new Date()
        },
        {
          id: 10,
          description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, facilis?',
          user: {
            id: 3,
            name: 'ash ponga'
          },
          txnDate: new Date()
        },
      ],
      areaChart: {
        series: [
          {
            id: 1,
            name: 'Previous Yr',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          },
          {
            id: 2,
            name: 'Current Yr',
            data: [44, 22, 55, 12, 88, 23, 76, 91]
          }
        ],
        options: {
          chart: {
            id: 'test',
            type:'area'
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          },
          markers: {
            size: 10,
          },
          dataLabels: {
            enabled: true
          },
        }
      },
      donutChart: {
        series: [ 44, 55, 41, 17 ],
        options: {
          chart: {
            id: 'test2',
            type: 'donut',
            height: 300
          },
          labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
          legend: {
            position: 'bottom'
          },
        },
        
        
      }
    }
  },
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    }
  }
}
</script>

<style lang="scss" scoped>

  .content-header {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;

    .search-input {
      width: 240px;
      position: absolute;
      right: 0;
    }
  }

  .dashboard__info-box-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .progress__container {
    width: 100%;
    display: flex;
    height: 100%;
    align-items: center;
    flex-direction: column;
    padding: 10px 20px;
  }

  .dashboard__main-container {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

  .dashboard__content-cotainer {
    display: flex;
    height: 100%;
    width: 100%;
    margin: 20px 0px;
  }

  .dashboard__left-content {
    flex: 1;
    margin-right: 10px;
    height: 100%;
  }

  .dashboard__right-content {
    max-width: 325px;
    min-width: 325px;
    display: flex;
    min-height: 100%;

    .activity__feed {
      width: 100%;
      border: solid 1px lightgray;
      background-color: white;

      .activity__feed-header {
        padding: 10px;
        display: flex;
        height: 60px;
        align-items: center;
        border-bottom: solid 1px lightgray;
        margin-bottom: 5px;

        .activity__feed-title {
          font-size: 20pt;
        }

        .activity__feed-icon {
          height: 30px;
          width: 30px;
          margin-right: 10px;
        }
      }

      .activity__feed-content {
        padding: 10px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
      }

    }

  }

  .dashboard__chart {
    width: 80%;
    height: auto;
  }

  .donut__chart {
    width: 100%;
    height: auto;
  }

  .yearly__chart {
    border: solid 1px lightgray;
    background-color: white;

    .yearly__header {
      padding: 10px 15px;
      border-bottom: solid 1px lightgray;

      .yearly__title {
        font-size: 16pt;
        font-weight: bold;
      }

      .yearly__sub-title {
        font-size: 9pt;
        color: gray;
      }
    }

    .yearly__content {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .other__chart-container{
    height: auto;
    width: 100%;
    display: flex;
    margin-top: 20px;
    

    .other__chart {
      border: solid 1px lightgray;
      background-color: white;
      width: 50%;

      .other__header {
        padding: 10px 15px;
        border-bottom: solid 1px lightgray;

        .other__title {
          font-size: 16pt;
          font-weight: bold;
        }

        .other__sub-title {
          font-size: 9pt;
          color: gray;
        }
      }

      .other__content {
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: auto;
      }
    }
  }



</style>
