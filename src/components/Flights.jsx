import React, { useEffect, useState, Fragment } from 'react'
import styles from "../styles/Flights.module.scss"
import { fetcher } from '../utils/fetchers'
import { workersAPI } from '../endpoints'
import useIsMounted from '../hooks/useIsMounted'
import { convert_minutes_amount_to_time_string } from '../utils/helpers'

const Flights = () => {

    const mounted = useIsMounted()

    const [workersList, setWorkersList] = useState([])
    const [workerDetails, setWorkerDetails] = useState([])
    const [currentFlightDetails, setCurrentFlightDetails] = useState({})

    const [activeRows, setActiveRows] = useState({
        worker: 0,
        details: 0
    })

    // load additional flight details in the sidebar
    const get_flight_details = (index) => {
        if (mounted) {
            setActiveRows(prev => ({ ...prev, details: index }))
            setCurrentFlightDetails(workerDetails[index])
        }
    }

    // fetching detail according to active user
    const get_worker_details = (id, index) => {
        setWorkerDetails([])
        fetcher(workersAPI + id)
            .then(data => {
                if (mounted && data) {
                    setWorkerDetails(data)
                    setCurrentFlightDetails(data[0])
                    setActiveRows({
                        worker: index ? index : 0,
                        details: 0
                    })
                }
                document.documentElement.style.cursor = 'default'
            })
    }
  

    const hide_loading_cursor = () => {
        document.documentElement.style.cursor = 'default'
        /* render_loading() */
    }
    const render_worker = (worker) => (
        <tr key={worker.id}>
            <th onClick={() => get_worker_details(worker.id, i)} className={i === activeRows.worker ? styles.active : ""}>{worker.name}</th>
        </tr>
    )

    // initial fetching
    useEffect(() => {
        fetcher(workersAPI)
            .then(data => {
                if (mounted && data) {
                    setWorkersList(data)
                    get_worker_details(data[0].id)
                }
            })
        // eslint-disable-next-line
    }, [])

    return (
        <div className={styles.Flights}>
            <nav>
                <table>
                    <thead>
                        <tr>
                            <th>Workers</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            workersList.map((worker, i) => (
                                <tr key={worker.id}>
                                    <th onClick={() => get_worker_details(worker.id, i)} className={i === activeRows.worker ? styles.active : ""}>{worker.name}</th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </nav>
            <main>
                <table>
                    <thead>
                        <tr>
                            <th>Flight Number</th>
                            <th>Origin</th>
                            <th>Origin Date</th>
                            <th>Destination</th>
                            <th>Destination Date</th>
                        </tr>
                    </thead>
                    <tbody>


                        {
                            workerDetails.map((detail, i) => (
                                <tr key={"key" + i} onClick={() => get_flight_details(i)} className={i === activeRows.details ? styles.active : ""}>
                                    <th>{detail.num}</th>
                                    <th>{detail.from}</th>
                                    <th>{detail.from_date}</th>
                                    <th>{detail.to}</th>
                                    <th>{detail.to_date}</th>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </main>
            <aside>
                <table>
                    <tbody className={styles.noHover}>
                        {workerDetails.length > 0 &&
                            <Fragment>
                                <tr>
                                    <th className={styles.gray}>Plane Number</th>
                                    <th>
                                        {currentFlightDetails.plane}
                                    </th>
                                </tr>
                                <tr>
                                    <th className={styles.gray}>Duration of flight</th>
                                    <th>
                                        {currentFlightDetails.duration && convert_minutes_amount_to_time_string(currentFlightDetails.duration)}
                                    </th>
                                </tr>
                                <tr>
                                    <th className={styles.gray}>Origin gate</th>
                                    <th>
                                        {currentFlightDetails.from_gate}
                                    </th>
                                </tr>
                                <tr>
                                    <th className={styles.gray}>Destination gate</th>
                                    <th>
                                        {currentFlightDetails.to_gate}
                                    </th>
                                </tr>
                            </Fragment>
                        }
                        
                    </tbody>
                </table>
            </aside>
        </div>
    )
}

export default Flights
