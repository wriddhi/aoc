import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic' 
import QRCodeStyling from 'qr-code-styling'
import styles from '../styles/QrCode.module.css'

import { MdOutlineContentCopy, MdOutlineClose } from 'react-icons/md'

export default function QrCode({url, visible, setQrCode}) {

    const qrRef = useRef(null)
    const blur = useRef(null)

    const qrCode = new QRCodeStyling ({
        width: 200,
        height: 200,
        dotsOptions: {
            color: "#161623",
            // color: "#ffffff",
            type: "rounded"
        },
        cornersSquareOptions: {
            color: "#161623",
            // color: "#ffffff",
            type: "extra-rounded"
        },
        cornersDotOptions: {
            type: "dots"
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 20
        },
        backgroundOptions: {
            // color: "#202033"
            color: "gray"
        },
        data: url
    })

    const handleDownload = () => {
        qrCode.download({
            extension: "png"
        });
    }

    const handleCopy = async() => {
        try {
            await navigator.clipboard.writeText(url)
        } catch (error) {
            console.error('This website does not have permission to copy text on clipboard')
        }
    }

    const closeWindow = () => {
        setQrCode(false)
    }

    useEffect(() => {
        qrCode.append(qrRef.current)
    }, [qrCode])

    if(!qrCode){
        return null
    }

    useEffect(() => {
        const blurStyle = blur.current.style
        blurStyle.height = document.documentElement.offsetHeight+"px"
    }, [blur])
    


    return (
        <div className={styles.blur} id="blur" ref={blur}>
            <div className={styles.qrContainer}>
                <span className={styles.closeWindow} onClick={closeWindow}><MdOutlineClose/></span>
                <div className={styles.qrCode} ref={qrRef}/>
                <button className={styles.downloadBtn} onClick={handleDownload}>Download</button>
                <h1>OR</h1>
                <div className={styles.copyLink}>
                    <input disabled type="text" value={url}/>
                    <abbr title="Copy link to clipboard"><MdOutlineContentCopy onClick={handleCopy} className={styles.copyBtn}/></abbr>
                </div>
            </div>
        </div>
    )
}