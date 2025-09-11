import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ESTADOS } from '../../services/salidasStorage';

export function StatusBadge({ estado, size = 'medium' }) {
  const getStatusConfig = (estado) => {
    switch (estado) {
      case ESTADOS.SOLICITUD:
        return {
          color: '#f59e0b', // amber
          backgroundColor: '#fef3c7', // amber-100
          icon: 'pending',
          text: 'Solicitud'
        };
      case ESTADOS.ACEPTADO:
        return {
          color: '#10b981', // emerald
          backgroundColor: '#d1fae5', // emerald-100
          icon: 'check-circle',
          text: 'Aceptado'
        };
      case ESTADOS.RECHAZADO:
        return {
          color: '#ef4444', // red
          backgroundColor: '#fee2e2', // red-100
          icon: 'cancel',
          text: 'Rechazado'
        };
      default:
        return {
          color: '#6b7280', // gray
          backgroundColor: '#f3f4f6', // gray-100
          icon: 'help',
          text: estado || 'Desconocido'
        };
    }
  };

  const getSizeConfig = (size) => {
    switch (size) {
      case 'small':
        return { 
          fontSize: 12, 
          iconSize: 14, 
          paddingVertical: 2, 
          paddingHorizontal: 6,
          borderRadius: 8
        };
      case 'large':
        return { 
          fontSize: 16, 
          iconSize: 20, 
          paddingVertical: 8, 
          paddingHorizontal: 12,
          borderRadius: 12
        };
      default: // medium
        return { 
          fontSize: 14, 
          iconSize: 16, 
          paddingVertical: 4, 
          paddingHorizontal: 8,
          borderRadius: 10
        };
    }
  };

  const statusConfig = getStatusConfig(estado);
  const sizeConfig = getSizeConfig(size);

  return (
    <View 
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: statusConfig.backgroundColor,
        paddingVertical: sizeConfig.paddingVertical,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        borderRadius: sizeConfig.borderRadius,
        alignSelf: 'flex-start'
      }}
    >
      <MaterialIcons 
        name={statusConfig.icon} 
        size={sizeConfig.iconSize} 
        color={statusConfig.color}
        style={{ marginRight: 4 }}
      />
      <Text 
        style={{
          color: statusConfig.color,
          fontSize: sizeConfig.fontSize,
          fontWeight: '600'
        }}
      >
        {statusConfig.text}
      </Text>
    </View>
  );
}