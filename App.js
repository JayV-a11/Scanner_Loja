import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, FlatList } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-web';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [link, setLink] = useState([]);
  const [shopCart, setShopCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [showShoppingCart, setShowShoppingCart] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setLink(JSON.parse(data));
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {showShoppingCart ? 
        <View style={{height: '100%', width: '100%', paddingTop: 30}}>
          <View style={{ display: 'flex', flexDirection: 'row', padding: 10, backgroundColor: 'tomato'}}>
            <Text style={{width: '95%'}}>Carrinho</Text>
            <Icon name={`${showShoppingCart ? 'close' : 'shopping-cart'}`} size={30} color="black" onPress={() => setShowShoppingCart(!showShoppingCart)}/>
          </View>
          <View style={{padding: 10, height: '80%'}}>
              <FlatList
                data={shopCart}
                renderItem={({item}) => (
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text style={{width: '80%', marginBottom: 15}}>{item.name}</Text>
                      <Text>{`R$ ${item.price}`}</Text>
                    </View> 
                )}
                keyExtractor={item => item.id}
              />
          </View>
          <View style={styles.submit}>
            <Button title={'Fechar Compra'} onPress={() => setShowShoppingCart(false)} color='#68a0cf' />
          </View>    
        </View>
      :
        <>
          <View style={styles.qrCont}>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={{ height: 400, width: 400 }} />
          </View>

          {scanned && 
            <>
              <Text>{`Produto: ${link.name}, Valor: ${link.price}`}</Text>
              <Button title={'Colocar no carrinho'} onPress={() => {setScanned(false); shopCart.push(link); setTotal(total + parseFloat(link.price))}} color='tomato' />
            </>
          }

          <View>
            <Icon name={`${showShoppingCart ? 'close' : 'shopping-cart'}`} size={30} color="black" onPress={() => setShowShoppingCart(!showShoppingCart)}/>
          </View>
          <View>
            <Text>{`Total: R$ ${total}`}</Text>
          </View>
        </>
      }
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCont: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
  touchable: { padding: 16 },
  text: {
    fontSize: 21,
    color: "rgb(0,122,255)"
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
  }
});
