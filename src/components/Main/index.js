import React, { useMemo, useState } from "react";
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import * as htmlToImage from 'html-to-image';

import styles from './index.module.scss';
import MapCuboidComp from "../MapCuboid";
import LoadingMap from "../../UI/LoadingMap";


const GoogleMapComp = () => {

    const [mapImageData, setMapImageData] = useState(null)

    const position = useMemo(() => ({
        lat: 44,
        lng: -88,
    }), [])

    // Helps capturing snapshots removing all of the buttons, footer, etc from the map
    // Not optimised currently but does the job perfectly
    const filterElements = (element) => {
        const unnecessaryDivClasses = {
            'gmnoprint': 1,
            'gm-style-cc': 1,
            'gm-style-moc': 1,
        }
        const unnecessaryTags = {
            'BUTTON': 1,
            'IFRAME': 1,
            'A': 1,
            'SPAN': 1,
        }
        if (element.tagName === 'DIV') {
            for (let elementClass of element.classList) {
                if (elementClass in unnecessaryDivClasses) {
                    return false
                }
            }
            const childNodes = element.childNodes
            if (childNodes.length === 1) {
                if (childNodes[0].tagName in unnecessaryTags) {
                    return false
                }
            }
        }
        return true
    }

    // Taking a snapshot of the map as a Data URL
    const onClickHandler = async () => {
        const map = document.getElementsByClassName(styles.mapContainer)[0]
        htmlToImage.toPng(map, {
            skipFonts: true,
            includeQueryParams: true,
            style: {
                borderRadius: 0,
            },
            filter: filterElements,
        })
        .then(function (dataUrl) {
            setMapImageData(dataUrl)
        });
    }

    console.log(process.env);
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    const { isLoaded: isMapLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    return (
        <div className={styles.mainContainer}>
            <LoadingMap isLoading={isMapLoaded}>
                <GoogleMap
                    zoom={10}
                    center={position}
                    clickableIcons={false}
                    options={{
                        // To remove street control view
                        streetViewControl: false,
                        // To disable and hide all of the buttons on the map
                        // disableDefaultUI: true,
                    }}
                    mapContainerClassName={styles.mapContainer}
                >
                </GoogleMap>

                <button
                    className={styles.captureButton}
                    onClick={onClickHandler}
                >
                    Capture
                </button>
            </LoadingMap>
            <div 
                className={`
                    ${styles.mapContainer}
                    ${!mapImageData ? styles.invisible : ''}
                `}
            >
                <MapCuboidComp
                    mapImageData={mapImageData}
                />
            </div>
        </div>
    )
}


export default GoogleMapComp;