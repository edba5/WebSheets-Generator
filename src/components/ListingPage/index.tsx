import { RouteComponentProps } from '@reach/router'
import { navigate } from 'gatsby'
import React, { useEffect, useState } from 'react'
import { findSheetIdByPermalink } from '../../services/firebase'
import { getSheetsData } from '../../services/sheets'
import { SiteData } from '../../utils/models'
import Footer from './footer'
import Hero from './Hero'
import Listing from './Listing'
import SEO from './seo'
import GridLoader from 'react-spinners/GridLoader'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props
  extends RouteComponentProps<{
    permalink: string
  }> {}

const ListingPage: React.FC<Props> = ({ permalink }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [siteData, setSiteData] = useState()
  const [listingData, setListingData] = useState()

  const setSheetsData = (siteData, listingData) => {
    setSiteData(siteData)
    setIsDarkMode(siteData.darkMode)
    setListingData(listingData)
  }

  useEffect(() => {
    const executeAsyncOperations = async () => {
      const sheetId = await findSheetIdByPermalink(permalink.toLowerCase())

      if (!sheetId) {
        navigate('/')
        return
      }

      const { siteData, listingData } = await getSheetsData(sheetId)

      if (siteData && listingData) {
        setSheetsData(siteData, listingData)
      } else {
        navigate('/')
      }
    }

    executeAsyncOperations()
  }, [permalink])

  if (!siteData || !listingData) {
    return (
      <div className="flex h-screen">
        <div className="mx-auto mt-64">
          <GridLoader color={'#049663'} />
        </div>
      </div>
    )
  }

  const { sitePrimaryColor, siteName, heroTitle, heroDescription } = siteData as SiteData
  let primaryColor = `${sitePrimaryColor}-500`
  switch (sitePrimaryColor) {
    case 'pink':
      primaryColor = `${sitePrimaryColor}-400`
      break
    case 'red':
      primaryColor = `${sitePrimaryColor}-600`
      break
    default:
      primaryColor = `${sitePrimaryColor}-500`
  }

  const lightTheme = {
    primary: primaryColor,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-gray-800',
    subtext: 'text-gray-600',
    altText: 'text-white',
    altSubtext: 'text-gray-400',
    background: 'bg-gray-100',
    altBackground: 'bg-gray-400',
    customShadow: 'shadow-xl',
  }

  const darkTheme = {
    primary: primaryColor,
    secondary: `${sitePrimaryColor}-800`,
    text: 'text-white',
    subtext: 'text-gray-400',
    altText: 'text-gray-800',
    altSubtext: 'text-gray-600',
    background: 'bg-gray-900',
    altBackground: 'bg-gray-600',
    customShadow: 'shadow-white',
  }

  const handleDarkModeClick = () => {
    setIsDarkMode(!isDarkMode)
  }

  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <div className={`${theme.background} min-h-screen`}>
      <SEO title={siteName} description={`${heroTitle} - ${heroDescription}`} />
      <Hero siteData={siteData} theme={theme} isDarkMode={isDarkMode} handleDarkModeClick={handleDarkModeClick} />
      <Listing listingData={listingData} siteData={siteData} theme={theme} />
      <Footer siteData={siteData} theme={theme} />
    </div>
  )
}

export default ListingPage
