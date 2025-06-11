import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { setupArcGISAuth } from "./arcGISAuth.service";
import { setArcgisAuth } from "store/store";

const ArcgisProvider = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        setupArcGISAuth().then(success => {
          if (success) {
            // auth success
            dispatch(setArcgisAuth(true));
            console.log('######## auth success')
          } else {
            // Failed to connect to ArcGIS. Please check your credentials
            dispatch(setArcgisAuth(false));
            console.log('######## Failed to connect to ArcGIS. Please check your credentials')
          }
        });
      }, []);

      return <></>;
};

export default ArcgisProvider;
