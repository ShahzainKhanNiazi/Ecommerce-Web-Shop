import React, { useEffect, useState } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';

import FormInput from './FormInput';
import { commerce } from '../../lib/commerce';

const AddressForm = ({checkoutToken, next}) => {
    const [ shippingCountries, setShippingCountries ] = useState([]);
    const [ shippingCountry, setShippingCountry ] = useState("");
    const [ shippingSubDivisions, setShippingSubDivisions ] = useState([]);
    const [ shippingSubDivision, setShippingSubDivision ] = useState("");
    const [ shippingOptions, setShippingOptions ] = useState([]);
    const [ shippingOption, setShippingOption ] = useState("");
    const methods = useForm();

    const countries = Object.entries(shippingCountries).map(([code, name]) => ( {id: code, label: name})) ;
    const subdivisions = Object.entries(shippingSubDivisions).map(([code, name]) => ( {id: code, label: name})) ;
    const options = shippingOptions.map((sO) => ({id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }));

    const fetchShippingCountries = async (checkoutTokenId) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

        console.log('These are countries ',countries);
        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    }

    const fetchShippingSubdivisions = async (countryCode) => {
        const { subdivisions} = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubDivisions(subdivisions);
        setShippingSubDivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options  = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region });

        setShippingOptions(options);
        setShippingOption(options[0].id);
    }

    useEffect(() => {
        fetchShippingCountries(checkoutToken.id);
    }
    , [])

    useEffect(() => {
       if(shippingCountry) fetchShippingSubdivisions(shippingCountry);
    }
    , [shippingCountry])

    useEffect(() => {
        if(shippingSubDivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubDivision);
     }
     , [shippingSubDivision])

     console.log('this is options', shippingOptions);

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubDivision, shippingOption}))}>
                   <Grid container spacing={3}>
                     <FormInput name="firstName" label="First name"  />
                     <FormInput name="lastName" label="Last name"  />
                     <FormInput name="address" label="Address" />
                     <FormInput name="email" label="Email" />
                     <FormInput name="city" label="City" />
                     <FormInput name="zip" label="ZIP / Postal code" />
                     
                     <Grid item xs={12} sm={6}>
                         <InputLabel>Shipping Country</InputLabel>
                         <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)} >
                            { countries.map((country) => (
                             <MenuItem key={country.id} value={country.id}>
                                 {country.label}
                             </MenuItem>
                            ))}                              
                         </Select>
                     </Grid>

                     <Grid item xs={12} sm={6}>
                         <InputLabel>Shipping Division</InputLabel>
                         <Select value={shippingSubDivision} fullWidth onChange={(e) => setShippingSubDivision(e.target.value)}>
                           { subdivisions.map((subdivision) => (
                            <MenuItem key={subdivision.id} value={subdivision.id}>
                                {subdivision.label}
                             </MenuItem>
                           ))}                         
                         </Select>
                     </Grid>

                     <Grid item xs={12} sm={6}>
                         <InputLabel>Shipping Options</InputLabel>
                         <Select value={shippingOption} fullWidth onChange={(e) => ( setShippingOption(e.target.value)) }>
                           {options.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                 {option.label}
                             </MenuItem>
                           ))}        
                         </Select>
                     </Grid>
                   </Grid>
                   <br/>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                           <Button component={Link} to='/cart' variant="outlined">Back to Cart</Button>
                           <Button type="submit" variant="contained" color="primary">Next</Button>                           
                      </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm;